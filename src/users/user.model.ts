import * as mongoose from 'mongoose';
import { User } from './user.interface';

const addressSchema = new mongoose.Schema({
    city: String,
    street: String,
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    // One-To-One的数据关系
    address: addressSchema
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;