import mongoose from 'mongoose';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [80, 'El nombre no puede superar 80 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, 'El correo no es válido'],
      maxlength: [120, 'El correo no puede superar 120 caracteres'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'El teléfono no puede superar 30 caracteres'],
      default: '',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'El mensaje no puede superar 1000 caracteres'],
      default: '',
    },
    status: {
      type: String,
      enum: ['nuevo', 'leido'],
      default: 'nuevo',
      index: true,
    },
  },
  { timestamps: true },
);

messageSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('Message', messageSchema);
