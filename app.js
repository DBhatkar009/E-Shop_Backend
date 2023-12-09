const express = require('express'); //install packages:- npm i express
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan'); //install packages:- npm i morgan
const mongoose = require('mongoose'); //install packages:- npm i mongoose
const cors = require('cors');  //install packages: npm i cors

const productRouter = require('./router/product');
const registrationRouter = require('./router/registration');


require('dotenv/config'); //install packages:- npm i dotenv 

//middleware
// app.use(bodyParser.json()); deprecated bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(cors());
app.use('*', cors());
const api = process.env.API_URL;


// Routers
app.use(`${api}/products`, productRouter)
app.use(`${api}/registrations`, registrationRouter)



mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database Connection is Ready...')
})
.catch((err)=>{
    console.log(err)
})


app.listen(3000, ()=>{
    console.log(api);
    console.log('server is running http://localhost:4000');
})