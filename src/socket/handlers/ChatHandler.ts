import { Server, Socket } from "socket.io";
import { callbackFn } from "../../utils/CallbackFn";
import { chatService } from "../../modules/chat/chat.service";

export const getChatList = async (
    userId: string,
    io: Server,
    socket: Socket,
    callback: (arg: any) => void,
): Promise<void> => {
    try {
        const chatList = await chatService.getMyChatList(userId);
        const myChat = 'chat-list::' + userId?.toString();

        io.emit(myChat, chatList);

        callbackFn(callback, { success: true, message: chatList });
    } catch (error: any) {
        callbackFn(callback, {
            success: false,
            message: error.message,
        });
        socket.emit('io-error', { success: false, message: error.message });
    }
}