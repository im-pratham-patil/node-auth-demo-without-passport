const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();
require('./helper/init_mongodb');

const indexRouter = require('./routes/index.route');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/', indexRouter);

app.use(async (req, res, next) => {
  next(createError.NotFound("This route doesn't exists"));
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: error.status || 500,
    },
  });
});

app.listen(3000, () => {
  console.log(`Server is up 🚀 and running at port ${port}`);
});
