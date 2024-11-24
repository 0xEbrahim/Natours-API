import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).json({message:'Hi from the server side..'});
});

app.listen(port, () => {
  console.log(`Application started running on port ${port}`);
});
