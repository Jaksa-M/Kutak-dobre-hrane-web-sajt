import mongoose from 'mongoose';

const canvasSchema = new mongoose.Schema({
  elements: [{ type: mongoose.Schema.Types.Mixed }] // Mixed type to store any kind of data
});

export default mongoose.model('CanvasModel', canvasSchema,'canvas');