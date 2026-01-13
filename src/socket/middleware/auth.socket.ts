import { Socket } from "socket.io";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"
import { User } from "../../modules/user/user.models";


export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {

    const token =
        socket.handshake.auth?.token || socket.handshake.headers?.token;
      //----------------------check Token and return user details-------------------------//
      const decode = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

       const user = await User.findOneAndUpdate({ _id: decode.userId }, { isOnline: true }, { new: true }).select('-password');

    if (!user) return next(new Error('Authentication failed'));

    // Attach user to socket (use type assertion if needed)
    socket.data = {
      userId: user?._id,
      name: user?.first_name,
      role : user?.role
    };

    next();
  } catch (err) {
    next(err as Error);
  }
};