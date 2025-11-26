import admin from "firebase-admin";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { INotification } from "./notification.inerface";
import Notification from "./notification.model";
import config from "../../config";

// Initialize Firebase Admin SDK only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("./firebase.json"),
  });
}

export const sendNotification = async (
  fcmToken: string[],
  payload: INotification,
  notification: boolean
): Promise<unknown> => {

  try {

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

    if (fcmToken.length <= 0 || !notification) {
      return;
    }


    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,
      notification: {
        title: payload.title,
        body: payload.message,
      },
      android: {
        notification: {
          icon: config.BASE_URL + '/logo.png',
          imageUrl: config.BASE_URL + '/logo.png',
          clickAction: 'notification'
        }
      },
      apns: {
        headers: {
          "apns-push-type": "alert",
        },
        fcmOptions: {
          imageUrl: config.BASE_URL + '/logo.png'
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
          image: config.BASE_URL + '/logo.png'
        }
      },
    });

    // Log any individual token failures
    if (response?.failureCount > 0) {
      response.responses.forEach((res, index) => {
        if (!res.success) {
          console.error(
            `FCM error for token at index ${index}: ${JSON.stringify(
              res?.error
            )}`
          );
        }
      });
    }

    return response;
  } catch (error: any) {

    // Handle specific Firebase third-party auth error
    if (error?.code === "messaging/third-party-auth-error") {
      console.error("FCM auth error:", error.message);
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



export const sendMultipleNotification = async (
  fcmToken: string[],
  payload: INotification[],
  { title, message }: { title: string, message: string }
): Promise<unknown> => {
  try {


    await Notification.insertMany(payload)

    if (fcmToken.length <= 0) {
      return;
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,
      notification: {
        title: title,
        body: message,
      },
      android: {
        notification: {
          icon: config.BASE_URL + '/logo.png',
          imageUrl: config.BASE_URL + '/logo.png',
          clickAction: 'notification'
        }
      },
      apns: {
        headers: {
          "apns-push-type": "alert",
        },
        fcmOptions: {
          imageUrl: config.BASE_URL + '/logo.png'
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
          image: config.BASE_URL + '/logo.png'
        }
      },
    });


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