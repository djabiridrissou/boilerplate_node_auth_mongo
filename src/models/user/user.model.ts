import mongoose, { Document, Model } from 'mongoose';

interface UserProps extends Document {
    userId: string;
    fullName: string;
    identifier: string;
    password: string;
    passwordToChange: string;
    role: string;
    connected: boolean;
}

const userSchema = new mongoose.Schema<UserProps>({
    userId: { type: String },
    fullName: { type: String },
    identifier: { type: String },
    password: { type: String },
    passwordToChange: { type: String },
    role: { type: String },
    connected: { type: Boolean }
});
const UserModel: Model<UserProps> = mongoose.model('User', userSchema);

export default UserModel;