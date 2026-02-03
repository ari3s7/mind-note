import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI not found");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1); // crash app if DB fails
  }
};

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const contentTypes = ["image", "video", "article", "audio"] as const;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const tagSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const contentSchema = new Schema(
  {
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: ObjectId, ref: "Tag" }],
    userId: { type: ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const linkSchema = new Schema(
  {
    hash: { type: String, required: true, unique: true },
    userId: { type: ObjectId, ref: "User", required: true },
    contentId: { type: ObjectId, ref: "Content", required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
export const TagModel = mongoose.model("Tag", tagSchema);
export const ContentModel = mongoose.model("Content", contentSchema);
export const LinkModel = mongoose.model("Link", linkSchema);
