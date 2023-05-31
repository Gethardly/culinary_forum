import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import { randomUUID } from 'crypto';
import Recipe from './models/Recipe';
import * as fs from 'fs';

const fixturePhotos = fs.readdirSync('./public/images/recipe_photos/');

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('recipes');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [admin, user] = await User.create(
    {
      displayName: 'Test Admin',
      email: 'test@test.com',
      role: 'admin',
      password: '123',
      token: randomUUID(),
    },
    {
      displayName: 'Test User',
      email: 'user@test.com',
      password: '123',
      token: randomUUID(),
    },
  );

  const [cheese, vareniks] = await Recipe.create(
    {
      owner: user._id,
      title: 'Домашние сырные палочки',
      ingredients: ['Сыр твердый - 300г', 'Яйцо - 1шт', 'Мука - 30г', 'Масло растительное 70мл'],
      instructions:
        'Приготовим продукты для сырных палочек. \n Сыр натереть на мелкой терке, добавить муку, яйцо. \n Перемешать. \n' +
        'Сформировать сырные палочки. \n Обжарить их в растительном масле до золотистого цвета.',
      photoGallery: fixturePhotos.filter((photo) => photo.includes('cheese')),
    },
    {
      owner: admin._id,
      title: 'Ленивые вареники',
      ingredients: [
        'Творог - 200г',
        'Яйцо куриное - 1шт',
        'Мука - 5ст.ложек',
        'Соль - 1/3 ч.ложки',
        'Сахар - 1 ст.ложка',
        'Масло сливочное - 20г',
        'Сметана - по вкусу',
      ],
      instructions:
        'Поставить на огонь 2 л воды.' +
        'В миску поместить творог. Размять.\n' +
        'Добавить к творогу яйцо. Добавить соль (0,3 ч. ложки) и сахар. Тщательно перемешать.\n' +
        'Добавить муку.\nЗамесить творожное тесто.Скатать колбаску.\n' +
        'Нарезать творожное тесто небольшими кусочками.\nВода вскипела. Посолить воду (1 ч. ложка). В кипящую воду выложить ленивые вареники. Как только они всплывут, варить на среднем огне 2 минуты.\n' +
        'Шумовкой достать ленивые вареники, выложить на тарелку, смазать сливочным маслом. Подавать ленивые вареники со сметаной.\n' +
        'Приятного аппетита!\n',
      photoGallery: fixturePhotos.filter((photo) => photo.includes('var')),
    },
  );

  await User.updateOne(
    { _id: user.id },
    {
      $push: {
        recipes: cheese._id,
        subscriptions: admin._id,
        subscribers: admin._id,
      },
    },
  );
  await User.updateOne(
    { _id: admin.id },
    {
      $push: {
        recipes: vareniks._id,
        subscriptions: user._id,
        subscribers: user._id,
      },
    },
  );

  await db.close();
  console.log('Success');
};
void run();
