/* eslint-disable max-len */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const userModel = require('./models/User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/uploads/`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const uploads = multer({ storage });
require('dotenv').config();

// connect to mongoose
mongoose.connect(process.env.mongoDbConnectionURI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected to DB');
});

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

// Import Excel File to MongoDB database
async function importExcelData2MongoDB(filePath) {
  try {
    // -> Read Excel File to Json Data
    const excelData = excelToJson({
      sourceFile: filePath,
      sheets: [{
        name: 'Users',
        // Header Row -> be skipped and will not be present at our result object.
        header: {
          rows: 1
        },
        columnToKey: {
          A: 'state',
          B: 'name',
          C: 'district',
          D: 'mobile',
          E: 'pin',
        }
      }]
    });
    await userModel.insertMany(excelData?.Users);
    fs.unlinkSync(filePath);
  } catch (err) {
    console.log(err);
  }
}

app.use('/api/v1', api);

// Upload excel file and import to mongodb
app.post('/api/v2/uploadfile', uploads.single('uploadfile'), async (req, res) => {
  try {
    importExcelData2MongoDB(`${__dirname}/uploads/${req.file.filename}`);
    res.status(200).send('Uploaded');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
