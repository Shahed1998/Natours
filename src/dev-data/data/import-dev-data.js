// Script to import data from json to db
require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

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

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// Add tours to db
const importTour = async () => {
  try {
    await Tour.create(tours);
    process.stdout.write('Data is successfully added');
  } catch (err) {
    process.stdout.write(`${err}\n`);
  }
  process.exit();
};

// Delete tours on db
const deleteTour = async () => {
  try {
    await Tour.deleteMany();
    process.stdout.write('Successfully deleted data');
  } catch (err) {
    process.stdout.write(`${err}\n`);
  }
  process.exit();
};

if (process.argv.includes('--import')) {
  importTour();
} else if (process.argv.includes('--delete')) {
  deleteTour();
}
