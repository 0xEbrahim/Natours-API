import mongoose from 'mongoose';
import slugify from 'slugify';
//import validator from 'validator';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters'
      ],
      minlength: [
        10,
        'A tour name must have more than or equal to 10 characters'
      ]
      // validate: [
      //   validator.isAlpha,
      //   'A tour name should only contains alpha characters'
      // ]
    },
    slug: {
      type: String
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should be from [easy , medium , difficult]'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 0.0,
      min: [1.0, 'Rating must be above 1.0'],
      max: [5.0, 'Rating must be less than 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Invalid price discount value, should be less than the price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [
      {
        type: String
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [{ type: Date }],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [
        {
          type: Number
        }
      ],
      address: {
        type: String
      },
      description: { type: String }
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [
          {
            type: Number
          }
        ],
        address: {
          type: String
        },
        description: { type: String },
        day: Number
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Doc middlware
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query middlware that works on the query object and modify it before execution
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took: ${Date.now() - this.start} ms`);
  next();
});

// Aggregation middlware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true }
    }
  });
  next();
});

export default mongoose.model('Tour', tourSchema);
