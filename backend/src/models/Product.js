import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [120, 'El nombre no puede superar 120 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [600, 'La descripción no puede superar 600 caracteres'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    oldPrice: {
      type: Number,
      min: [0, 'El precio anterior no puede ser negativo'],
      default: null,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: {
        values: ['menu', 'producto'],
        message: 'La categoría debe ser "menu" o "producto"',
      },
      default: 'producto',
      index: true,
    },
    rating: {
      type: Number,
      min: [0, 'La calificación mínima es 0'],
      max: [5, 'La calificación máxima es 5'],
      default: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

productSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('Product', productSchema);
