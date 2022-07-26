// Server
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// Database connection
(async () => {
  try {
    const dbString = process.env.DB_STRING.replace(
      '<password>',
      process.env.DB_PASSWORD,
    );
    await mongoose.connect(dbString);
    if (process.env.NODE_ENV === 'development') {
      process.stdout.write('Connected with database\n');
    }
  } catch (err) {
    process.stdout.write(`${err}\n`);
  }
})();

// Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  name: 'Saint Martin',
  price: 123,
});

// testTour
//   .save()
//   .then((tour) => process.stdout.write(`${tour}\n`))
//   .catch((err) => process.stdout.write(err));

// process.stdout.write(`${dbString}\n`);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  process.stdout.write(`App running on port ${port}\n`);
});
