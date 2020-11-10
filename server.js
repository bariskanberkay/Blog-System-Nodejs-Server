require('rootpath')();
const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/error_handler');


const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({origin: (origin, callback) => callback(null, true),credentials: true}));

app.post('/', (req, res) => {
  res.send(req.body)
})

//AUTH ROUTES
app.use('/auth',require('./routes/auth.routes'));

app.use('/user',require('./routes/user.routes'));

//ERROR HANDLER
app.use(errorHandler);

const port = 4000;

app.listen(port,()=>console.log("Server Started on port "+port));