import { WebSocket } from 'ws';
import express from 'express';
import User from '../models/User';
import { IncomingMessage } from '../types';
import Message from '../models/Message';

interface ActiveConnections {
  [id: string]: WebSocket;
}

const activeConnections: ActiveConnections = {};

const wsChatRouter = express.Router();

wsChatRouter.ws('/', (ws) => {
  try {
    ws.on('message', async (data: string) => {
      const decodedData = JSON.parse(data.toString()) as IncomingMessage;
      if (decodedData.type === 'auth') {
        const token = decodedData.payload;
        const user = await User.findOne({ token });

        if (!user) {
          const error = {
            errorCode: 401,
            error: 'Unauthorized',
          };
          ws.send(JSON.stringify(error));
          ws.close();
        } else {
          const id = user._id.toString();
          activeConnections[id] = ws;
        }
      }

      if (decodedData.type === 'SEND_MESSAGE') {
        const { sender, recipient, content } = decodedData.payload;
        const findRecipient = await User.findById(recipient);
        if (!findRecipient && !content) {
          const error = {
            errorCode: 400,
            error: 'Recipient not found or content must be more then 1 character',
          };
          ws.send(JSON.stringify(error));
          return error;
        }
        const message = new Message({
          sender,
          recipient,
          content,
        });

        const savedMessage = await message.save();

        const getNewMessage = await Message.findOne({ _id: savedMessage.id }).populate('sender').populate('recipient');

        const newMessage = {
          type: 'NEW_MESSAGE',
          payload: getNewMessage,
        };

        ws.send(JSON.stringify(newMessage));

        Object.keys(activeConnections).find((liveUserId) => {
          if (message.recipient.toString() === liveUserId) {
            activeConnections[message.recipient.toString()].send(JSON.stringify(newMessage));
          }
        });
      }
    });
  } catch (e) {
    ws.on('error', () => {
      ws.send(JSON.stringify(e));
    });
  }
});

export default wsChatRouter;
