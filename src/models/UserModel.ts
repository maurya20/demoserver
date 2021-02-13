import mongoose, { Document } from 'mongoose';


type IUser = {
  username: string
  email: string
  password: string
}
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// export model user with UserSchema
const User = mongoose.model<IUser & Document>('User', UserSchema); 
export {User}