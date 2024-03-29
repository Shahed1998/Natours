/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must be less than 40 characters'],
      minlength: [10, 'Tour name must be more than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must contain only characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A duration is required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be within 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this only works during document creation
        validator(val) {
          return val < this.price;
        },
        message: 'Discount price {{VALUE}} must be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true, // removes whitespace
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // doesn't show to the user
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual is used when data shown to user
// doesn't need to be stored in db
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Mongoose middleware
// Document middleware
// pre: runs before saving data to document
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// post: runs after saving data to document
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// Query middleware
// Executing for any query starting with find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Aggregation middleware
// eslint-disable-next-line prefer-arrow-callback
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Model
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
