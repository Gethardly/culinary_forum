import express from 'express';
import auth, { RequestWithUser } from '../middleware/auth';
import Recipe from '../models/Recipe';
import { imagesUpload } from '../multer';
import User from '../models/User';

const recipesRouter = express.Router();

recipesRouter.get('/', async (req, res, next) => {
  try {
    const user = req.query.user;
    if (!user) {
      const recipes = await Recipe.find().populate('owner');
      return res.send(recipes);
    }

    const userRecipes = await Recipe.find({ owner: user });
    return res.send(userRecipes);
  } catch (e) {
    return next(e);
  }
});

recipesRouter.post('/', auth, imagesUpload.array('photoGallery', 10), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    if (!user) {
      return res.status(404).send({ error: 'User not found!' });
    }
    const photos = req.files as Express.Multer.File[];
    const photoGallery = photos?.map((file: Express.Multer.File) => file.filename);
    const recipe = await Recipe.create({
      owner: user._id,
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      photoGallery: photoGallery ? photoGallery : null,
    });
    await User.updateOne({ _id: user.id }, { $push: { recipes: recipe.id } });
    return res.send(recipe);
  } catch (e) {
    return next(e);
  }
});

recipesRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send({ error: 'Recipe not found!' });
    }
    if (user.role !== 'admin' && recipe.owner.toString() !== user.id) {
      return res.status(403).send({ error: "You're not the owner of this recipe" });
    }
    const deletedRecipe = await Recipe.deleteOne({ _id: req.params.id });
    await User.updateOne({ _id: user.id }, { $pull: { recipes: recipe.id } });
    return res.send(deletedRecipe);
  } catch (e) {
    return next(e);
  }
});

export default recipesRouter;
