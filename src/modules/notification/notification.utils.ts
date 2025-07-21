import admin from "firebase-admin";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { INotification } from "./notification.inerface";
import Notification from "./notification.model";

// Initialize Firebase Admin SDK only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("./firebase.json"),
  });
}

export const sendNotification = async (
  fcmToken: string[],
  payload: INotification
): Promise<unknown> => {
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,
      notification: {
        title: payload.title,
        body: payload.message,
      },
      android: {
        notification: {
          icon: "http://10.10.10.9:3000/logo.png",
          imageUrl: "http://10.10.10.9:3000/logo.png",
          clickAction: 'notification'
        }
      },
      apns: {
        headers: {
          "apns-push-type": "alert",
        },
        fcmOptions: {
          imageUrl: 'http://10.10.10.9:3000/logo.png'
        },
        payload: {
          aps: {
            badge: 1,
            sound: "default",
          },
        },
      },
      webpush: {
        headers: {
          image: 'http://10.10.10.9:3000/logo.png'
        }
      },
    });

    // If notifications were successfully sent, log them in the database
    if (response?.successCount > 0) {
      await Promise.all(
        fcmToken.map((token) =>
          Notification.create({
            sender: payload?.sender,
            receiver: payload?.receiver,
            receiverEmail: payload?.receiverEmail,
            receiverRole: payload?.receiverRole,
            title: payload.title,
            link: payload?.link || null,
            message: payload?.message,
            type: payload?.type || "accept",
          })
        )
      );
    }

    // Log any individual token failures
    if (response?.failureCount > 0) {
      response.responses.forEach((res, index) => {
        if (!res.success) {
          console.error(
            `FCM error for token at index ${index}: ${JSON.stringify(
              res.error
            )}`
          );
        }
      });
    }

    return response;
  } catch (error: any) {

    // Handle specific Firebase third-party auth error
    if (error?.code === "messaging/third-party-auth-error") {
      console.warn("FCM auth error:", error.message);
      return null;
    }

    // General error handling
    console.error("Error sending FCM message:", error);
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      error.message || "Failed to send notification"
    );
  }
};
