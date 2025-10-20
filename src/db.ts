import mongoose from 'mongoose';
const Schema  = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('MONGO_URI not found in .env');

try {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected successfully');
} catch (err) {
  console.error('MongoDB connection error:', err);
}


const contentTypes = ['image', 'video', 'article', 'audio'];

const userSchema = new Schema ({
   username: { type: String, required: true, unique: true},
   password: { type: String, required: true},
})

const tagSchema = new Schema ({
    title: {type: String, required: true, unique: true}
})


const contentSchema = new Schema ({
     link: {type: String, required: true},
     type: {type: String, enum: contentTypes, required: true},
     title: {type: String, required: true},
     tags: [{type: mongoose.Schema.Types.ObjectId, ref:'Tag'}],
     userId: {type: ObjectId, ref: 'User', required: true}
});


const linkSchema = new Schema ({
    hash: {type: String, required: true, unique: true},
    userId: {type: ObjectId, ref: 'User', required: true},
    contentId: { type: ObjectId, ref: "Content", required: true },
}) 

export const UserModel = mongoose.model("User", userSchema);
export const TagModel = mongoose.model("Tag", tagSchema);
export const ContentModel = mongoose.model("Content", contentSchema);
export const LinkModel = mongoose.model("Link", linkSchema);