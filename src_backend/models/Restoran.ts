import mongoose from 'mongoose'

const elementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sto', 'toalet', 'kuhinja'],
    required: true,
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  radius: { type: Number },
  width: { type: Number },
  height: { type: Number },
  members: { type: Number },
  color: { type: String, default: 'white' },
  selected: { type: Boolean},
  tableNumber: { type: Number }
}, { _id: false });

const jeloSchema = new mongoose.Schema(
  {
      name: String,
      image: String,
      price: Number,
      ingredients: [{ type: String }]
  },{ _id: false });

const workingTimeSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true }
}, { _id: false });

const restoranSchema = new mongoose.Schema(
  {
    konobar: [String],
    address: String,
    name: String,
    type: String,
    grades: Array,
    comments: [String],
    phone: String,
    description: String,
    menu: [jeloSchema],
    canvas: [elementSchema],
    workingTime: { type: Map, of: workingTimeSchema }
  },
  {
    versionKey: false  
  }
);

export default mongoose.model('RestoranModel', restoranSchema, 'restorani');
