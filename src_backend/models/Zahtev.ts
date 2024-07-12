import mongoose from 'mongoose'

const zahtevSchema = new mongoose.Schema(
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
        state: String,
        image: String
    },{
      versionKey:false  
    }
);

export default mongoose.model('ZahtevModel', zahtevSchema, 'zahtevi');