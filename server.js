import mongoose from 'mongoose';
import app from './app.js';

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log('Connected to database successfully..');
  })
  .catch(err => {
    throw err;
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application started running on port ${port}`);
});
