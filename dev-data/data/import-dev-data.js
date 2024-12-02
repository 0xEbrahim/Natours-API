import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../../models/tourModel.js';
import Review from '../../models/reviewModel.js';
import User from '../../models/userModel.js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: '.env' });
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log('Connected to database successfully..'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
