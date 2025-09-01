/* eslint-disable @typescript-eslint/no-explicit-any */

import { ObjectId } from "mongoose";
import {ObjectId as mongoId} from "mongodb"


export interface INotification {
  sender: ObjectId;
  receiver: ObjectId;
  receiverEmail: string;
  receiverRole: "user" | "admin";
  product ?: mongoId
  message: string;
  fcmToken?: string;
  type?: "text" | "accept" | "reject" | "cancelled" | "payment" | "product";
  title?: string;
  isRead?: boolean;
  link?: string;
}

// export interface ISendNotification {
//   sender: string | undefined;
//   receiver: string | undefined;
//   receiverEmail: string | undefined;
//   receiverRole: string | undefined;
//   title: string;
//   link: string | null;
//   message: string;
//   type?: "hireRequest" | "accept" | "reject" | "cancelled" | "payment";
// }
