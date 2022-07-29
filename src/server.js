// Server
const mongoose = require('mongoose');
require('dotenv').config();
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

// testTour
//   .save()
//   .then((tour) => process.stdout.write(`${tour}\n`))
//   .catch((err) => process.stdout.write(err));

// process.stdout.write(`${dbString}\n`);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  process.stdout.write(`App running on port ${port}\n`);
});
