import express from 'express';
import expressWs from 'express-ws';

const app = express();
expressWs(app);
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import usersRouter from './routers/users';
import recipesRouter from './routers/recipes';
import wsChatRouter from './routers/ws_chat';
import chatRouter from './routers/chat';

const port = 8000;
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);
app.use('/chat', wsChatRouter);
app.use('/messages', chatRouter);

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
  process.on('exit', () => {
    void mongoose.disconnect();
  });
};

run().catch(console.error);
