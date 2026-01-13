import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import httpStatus from 'http-status';
import AppError from '../error/AppError';
import { chatService } from '../modules/chat/chat.service';
import { MessageHandler, MsgSeenHandle, MsgStopTyping, MsgTyping, SendMessageHandle } from './handlers/MessageHandler';
import { getChatList } from './handlers/ChatHandler';
import { User } from '../modules/user/user.models';
import { socketAuthMiddleware } from './middleware/auth.socket';


const initializeSocketIO = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Online users
  // const onlineUser = new Set();

  io.use(socketAuthMiddleware);

  io.on('connection', async socket => {
    console.log('connected', socket?.id);

    try {
      const userId = socket.data?.userId;
      const role = socket.data?.role;

      if (!userId) {
        socket.emit('io-error', { success: false, message: 'invalid Token' });
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
      }

      socket.join(userId?.toString());

      //----------------------chatlist init-------------------------//
      const chatList = await chatService.getMyChatList(userId);
      const myChat = 'chat-list::' + userId?.toString();

      io.emit(myChat, chatList);

      //----------------------user details and messages send for front end -->(as need to use)------------------------//
      socket.on('message-page', async (payload, callback) => {

        MessageHandler(userId, payload?.userId, io, socket, callback)

      });

      //----------------------chat list------------------------//
      socket.on('my-chat-list', async (data, callback) => {
        getChatList(userId, io, socket, callback)
      });

      //----------------------seen message-----------------------//
      socket.on('seen', async (payload, callback) => {

        MsgSeenHandle(io, socket, payload, userId, callback);

      });

      socket.on('send-message', async (payload, callback) => {

        SendMessageHandle(io, socket, payload, userId, callback)

      });

      //-----------------------Typing------------------------//
      socket.on('typing', function (payload, callback) {

        MsgTyping(socket, io, payload, callback, socket.data?.name)

      });

      socket.on('stopTyping', function (payload, callback) {
        MsgStopTyping(socket, io, payload, callback, socket.data?.name)
      });

      //-----------------------Seen All------------------------//
      socket.on('message-notification', async ({ }, callback) => {

      });

      //-----------------------Disconnect------------------------//
      socket.on('disconnect', async () => {
        // onlineUser.delete(user?._id?.toString());
        await User.updateOne({ _id: userId }, { isOnline: false })
        // io.emit('onlineUser', Array.from(onlineUser));

        const chatList = await chatService.getMyChatList(userId);
        const myChat = 'chat-list::' + userId?.toString();
        io.emit(myChat, chatList);

        console.log('disconnect user ', socket.id);
      });

    } catch (error) {
      console.error('-- socket.io connection error --', error);
      socket.emit('error', { message: "connection error" })
    }
  });

  return io;
};

export default initializeSocketIO;
