import express from 'express';
import User from '../models/User';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';

const usersRouter = express.Router();

usersRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      displayName: req.body.displayName,
      password: req.body.password,
      role: req.body.role,
    });
    user.generateToken();
    await user.save();
    return res.send({ message: 'Registered successfully! ', user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

usersRouter.get('/', auth, permit('admin'), async (req, res, next) => {
  let page = parseInt(req.query.page as string);
  let perPage = parseInt(req.query.perPage as string);

  page = isNaN(page) || page <= 0 ? 1 : page;
  perPage = isNaN(perPage) || perPage <= 0 ? 10 : perPage;

  try {
    const count = await User.count();
    let pages = Math.ceil(count / perPage);

    if (pages === 0) pages = 1;
    if (page > pages) page = pages;

    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.send({ users, page, pages, count, perPage });
  } catch (e) {
    return next(e);
  }
});

usersRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    return res.send(user);
  } catch (e) {
    return next(e);
  }
});

usersRouter.put('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const { email, displayName, password, role } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ error: 'No user found!' });
    }

    if (email && email !== user.email) {
      user.email = email;
    }
    if (displayName && displayName !== user.displayName) {
      user.displayName = displayName;
    }
    if (password && password !== user.password) {
      user.password = password;
    }
    if (role && role !== user.role) {
      user.role = role;
    }

    const result = await user.save();

    return res.send(result);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send({ error: 'Email or password is incorrect!' });
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({ error: 'Email or password is incorrect!' });
  }

  try {
    user.generateToken();
    await user.save();

    return res.send({ message: 'Username and password correct!', user });
  } catch (e) {
    return next(e);
  }
});

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const success = { message: 'ok' };

    if (!token) {
      return res.send(success);
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.send(success);
    }

    user.generateToken();
    await user.save();
    return res.send(success);
  } catch (e) {
    return next(e);
  }
});

usersRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.send({ error: 'User is not found!' });
    }

    const deletedUser = await User.deleteOne({ _id: req.params.id });
    return res.send(deletedUser);
  } catch (e) {
    return next(e);
  }
});

export default usersRouter;
