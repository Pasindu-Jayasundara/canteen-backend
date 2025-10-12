import { Document, ObjectId } from "mongoose";

export interface User extends Document {
  _id: ObjectId;
  universityMail: string;
}