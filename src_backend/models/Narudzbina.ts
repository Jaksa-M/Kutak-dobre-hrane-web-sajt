import mongoose from 'mongoose';

const JeloSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  ingredients: [String]

});

const KorpaSchema = new mongoose.Schema({
  jela: [JeloSchema],
  amounts: [Number]
});

const narudzbinaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  status: String,
  expectedTime: String,
  restoran: String,
  korpa: KorpaSchema,
  name: String,
  date: String,
  total_price: Number
}, {
  versionKey: false
});

export default mongoose.model('NarudzbinaModel', narudzbinaSchema, 'narudzbine');
