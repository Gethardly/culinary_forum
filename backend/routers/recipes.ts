import express from 'express';
import auth, { RequestWithUser } from '../middleware/auth';
import Recipe from '../models/Recipe';
import { imagesUpload } from '../multer';
import User from '../models/User';

const recipesRouter = express.Router();

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
    const deletedRecipe = await Recipe.deleteOne({ _id: req.params.id });
    await User.updateOne({ _id: user.id }, { $pull: { recipes: recipe.id } });
    return res.send(deletedRecipe);
  } catch (e) {
    return next(e);
  }
});

export default recipesRouter;
