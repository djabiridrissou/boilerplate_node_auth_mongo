import mongoose, { Document, Model } from 'mongoose';

interface UserProps extends Document {
    userId: string;
    fullName: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<UserProps>({
    userId: { type: String },
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
});
const UserModel: Model<UserProps> = mongoose.model('User', userSchema);

export default UserModel;