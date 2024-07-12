import mongoose from 'mongoose'

const rezervacijaSchema = new mongoose.Schema(
    {
        restoran: String,
        request: String,
        time: String,
        date: String,
        people: Number,
        grade: Number,
        comment: String,
        tableNum: Number,
        reservationTime: Number,
        state: String,
        rejectedComment: String,
        user: String,
        konobar: String
    },{
      versionKey:false  
    }
);

export default mongoose.model('RezervacijaModel', rezervacijaSchema, 'rezervacije');