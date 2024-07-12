import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        firstname: String,
        lastname: String,
        type: String,
        gender: String,
        address: String,
        phone: String,
        mail: String,
        credit_card: String,
        question: String,
        answer: String,
        active: Boolean,
        image: String,
        not_showed: Number,
        blocked: Boolean,
        restaurant: String
    },{
      versionKey:false  
    }
);

export default mongoose.model('UserModel', userSchema, 'users');