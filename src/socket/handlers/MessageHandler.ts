import { Server, Socket } from "socket.io";
import { callbackFn } from "../../utils/CallbackFn";
import Message from "../../modules/messages/messages.models";
import { User } from "../../modules/user/user.models";
import { IMessages } from "../../modules/messages/messages.interface";
import httpStatus from "http-status";
import Chat from "../../modules/chat/chat.models";
import { Types } from "mongoose";
import { getChatList } from "./ChatHandler";

export const MessageHandler = async (
    myId: number,
    userId: number,
    io: Server,
    socket: Socket,
    callback: (arg: any) => void,
): Promise<void> => {
    try {

        if (!userId) {
            callbackFn(callback, {
                success: false,
                message: 'userId is required',
            });
            socket.emit('io-error', {
                success: false,
                message: 'userId id is required',
            });
        }

        const receiverDetails = await User.findById(
            userId,
        ).select('_id email role image');

        if (!receiverDetails) {
            callbackFn(callback, {
                success: false,
                message: 'user is not found!',
            });
            socket.emit('io-error', {
                success: false,
                message: 'user is not found!',
            });
        }
        const payload = {
            _id: receiverDetails?._id,
            full_name: receiverDetails?.first_name + " " + receiverDetails?.last_name,
            email: receiverDetails?.email,
            image: receiverDetails?.image,
            role: receiverDetails?.role,
        };

        socket.emit('user-details', payload);

        const getPreMessage = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId },
            ],
        }).sort({ createdAt: 1 });

        socket.emit('message', getPreMessage || []);

        // Notification

    } catch (error: any) {
        callbackFn(callback, {
            success: false,
            message: error.message,
        });
        socket.emit('io-error', { success: false, message: error });
        console.error('Error in message-page event:', error);
    }
}

export const SendMessageHandle = async (
    io: Server,
    socket: Socket,
    req_payload: IMessages,
    userId: number,
    callback: (arg: any) => void
) => {
    try {
        let payload;

        // validate payload
        if (typeof req_payload === 'string') {
            try {
                payload = JSON.parse(req_payload);
            } catch {
                return callbackFn(callback, {
                    statusCode: 400,
                    success: false,
                    message: 'Invalid JSON payload',
                });
            }
        } else if (typeof req_payload === 'object' && req_payload !== null) {
            payload = req_payload;
        } else {
            return callbackFn(callback, {
                statusCode: 400,
                success: false,
                message: 'Payload must be an object',
            });
        }

        if (!payload?.receiver) {
            callbackFn(callback, {
                success: false,
                message: 'receiver is required',
            });
            socket.emit('io-error', {
                success: false,
                message: 'receiver id is required',
            });
            return
        }

        payload.sender = userId;

        const alreadyExists = await Chat.findOne({
            participants: { $all: [payload.sender, payload.receiver] },
        }).populate(['participants']);

        if (!alreadyExists) {
            const chatList = await Chat.create({
                participants: [payload.sender, payload.receiver],
            });

            payload.chat = chatList?._id;
        } else {
            payload.chat = alreadyExists?._id;
        }

        const result = await Message.create(payload);

        if (!result) {
            callbackFn(callback, {
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: 'Message sent failed',
            });
            socket.emit('io-error', {
                success: false,
                message: 'Message sent failed',
            });
            return
        }

        const senderMessage = 'new-message::' + payload.receiver.toString();

        io.emit(senderMessage, result);

        // //----------------------hit on chatlist for see last sent message with the chatList------------------------//
        getChatList(result?.sender.toString(), io, socket, callback)
        getChatList(result?.receiver.toString(), io, socket, callback)

    } catch (error: any) {
        callbackFn(callback, {
            success: false,
            message: error.message,
        });
        console.error('Error in seen event:', error);
        // socket.emit('error', { message: error.message });
    }
}

export const MsgSeenHandle = async (
    io: Server,
    socket: Socket,
    req_payload: { chatId: number },
    userId: number,
    callback: (arg: any) => void
) => {
    try {
        const { chatId } = req_payload;

        if (!chatId) {
            callbackFn(callback, {
                success: false,
                message: 'chatId id is required',
            });
            socket.emit('io-error', {
                success: false,
                message: 'chatId id is required',
            });
        }

        const chatList = await Chat.findById(chatId);
        if (!chatList) {
            callbackFn(callback, {
                success: false,
                message: 'chat id is not valid',
            });
            socket.emit('io-error', {
                success: false,
                message: 'chat id is not valid',
            });
            return;
        }

        // const messageIdList = await Message.aggregate([
        //     {
        //         $match: {
        //             chat: new Types.ObjectId(chatId),
        //             seen: false,
        //             sender: { $ne: new Types.ObjectId(userId) },
        //         },
        //     },
        //     { $group: { _id: null, ids: { $push: '$_id' } } },
        //     { $project: { _id: 0, ids: 1 } },
        // ]);
        // const unseenMessageIdList =
        //     messageIdList.length > 0 ? messageIdList[0].ids : [];

        const updateMessages = await Message.updateMany(
            // { _id: { $in: unseenMessageIdList } },
            {
                chat: new Types.ObjectId(chatId),
                seen: false,
                sender: { $ne: new Types.ObjectId(userId) }
            },
            { $set: { seen: true } },
        );

        const user1 = chatList.participants[0];
        const user2 = chatList.participants[1];


        // const allUnReaddMessage = await Message.countDocuments({
        //     receiver: user1,
        //     seen: false,
        // });
        // const variable = 'new-notifications::' + user1;
        // io.emit(variable, allUnReaddMessage);

        // const allUnReaddMessage2 = await Message.countDocuments({
        //     receiver: user2,
        //     seen: false,
        // });
        // const variable2 = 'new-notifications::' + user2;
        // io.emit(variable2, allUnReaddMessage2);

        // const getPreMessage = await Message.find({
        //     $or: [
        //         { sender: user1, receiver: user2 },
        //         { sender: user2, receiver: user1 },
        //     ],
        // }).sort({ updatedAt: 1 });

        // socket.emit('message', getPreMessage || []);

        //----------------------hit on chatlist for see unseen count message with the chatList------------------------//
        getChatList(user1?.toString(), io, socket, callback)
        getChatList(user2?.toString(), io, socket, callback)

    } catch (error: any) {
        callbackFn(callback, {
            success: false,
            message: error.message,
        });
        console.error('Error in seen event:', error);
        socket.emit('error', { message: error.message });
    }
}

export const MsgTyping = async (
    socket: Socket,
    io: Server,
    payload: IMessages,
    callback: (arg: any) => void,
    user_name: string
) => {
    try {

        const { receiver } = payload

        if (!payload?.receiver) {
            callbackFn(callback, {
                success: false,
                message: 'receiver is required',
            });
            socket.emit('io-error', {
                success: false,
                message: 'receiver id is required',
            });
            return;
        }

        const chat = 'typing::' + receiver.toString();
        const message = user_name + ' is typing...';
        socket.emit(chat, { message: message });

    } catch (error: any) {
        callbackFn(callback, {
            success: false,
            message: error.message,
        });
        console.error('Error in seen event:', error);
        // socket.emit('error', { message: error.message });
    }
}

export const MsgStopTyping = async (
    socket: Socket,
    io: Server,
    payload: IMessages,
    callback: (arg: any) => void,
    user_name: string
) => {
    try {
        const { receiver } = payload;

        if (!payload?.receiver) {
            callbackFn(callback, {
                success: false,
                message: 'receiver is required',
            });
            socket.emit('io-error', {
                success: false,
                message: 'receiver id is required',
            });
            return;
        }

        const chat = 'stopTyping::' + receiver.toString();
        const message = user_name + ' is stop typing...';
        socket.emit(chat, { message: message });

    } catch (error: any) {
        callbackFn(callback, {
            success: false,
            message: error.message,
        });
        console.error('Error in seen event:', error);
        // socket.emit('error', { message: error.message });
    }
}