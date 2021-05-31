const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

app.use(cors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "allowedHeaders": "Access-Control-Allow-Origin, Content-Type, Authorization"
    }
));

app.use(bodyParser.json());

const mongoUri="mongodb://localhost:27017/Exc-test";
mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true

});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', err => {
  console.error('Error connecting to mongo', err);
});


app.get('/', (req, res) => {
  res.status(201).send(
  {
    status: 0,
    message: 'Home Route does not exists',
  });
});


//api routes
const candidateApi = require("./routes/api/candidateApi");
const testApi = require("./routes/api/testApi");

//use of routes
app.use("/api/candidate", candidateApi);
app.use("/api/tests", testApi);

app.get("*", (req,res) => {
  res.status(400).send(
    {
      status: 0,
      message: 'This request does not have any endpoint'
    });
});

const port =3000;
// const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
