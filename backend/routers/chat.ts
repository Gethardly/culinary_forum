import express from 'express';
import auth, { RequestWithUser } from '../middleware/auth';
import Message from '../models/Message';
import User from '../models/User';

const chatRouter = express.Router();

chatRouter.get('/:id?', auth, async (req, res, next) => {
  const user = (req as RequestWithUser).user;
  const recipientId = req.params.id;
  try {
    if (recipientId) {
      const messages = await Message.find({
        $or: [
          { sender: user.id, recipient: recipientId },
          {
            sender: recipientId,
            recipient: user._id,
          },
        ],
      })
        .populate('sender')
        .populate('recipient');
      return res.send(messages);
    }
    const recievedMessagesUsersId = await Message.find({ recipient: user._id }).select('sender').distinct('sender');
    const sendedMessagesUserId = await Message.find({ sender: user._id }).select('recipient').distinct('recipient');
    const listOfChatedUsers = await User.find({ _id: recievedMessagesUsersId.concat(sendedMessagesUserId) });
    return res.send(listOfChatedUsers);
  } catch (e) {
    return next(e);
  }
});

export default chatRouter;
