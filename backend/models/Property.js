const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: 0,
    },
    area: {
      type: Number, // in sq ft
      required: [true, 'Area is required'],
    },
    type: {
      type: String,
      enum: ['Rent', 'Sale'],
      required: [true, 'Type (Rent/Sale) is required'],
    },
    propertyCategory: {
      type: String,
      enum: ['Apartment', 'House', 'Villa', 'Plot', 'Commercial'],
      default: 'Apartment',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    contactName: {
      type: String,
      default: 'Owner',
    },
    contactPhone: {
      type: String,
      default: '9999999999',
    },
    ownerId: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
