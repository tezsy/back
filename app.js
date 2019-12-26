//require packages fron npm
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator')
const cors = require('cors')
require('dotenv').config();

//import from other file
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require("./routes/order");
const mercari = require("./routes/mercari");
const rakuten = require("./routes/rakuten");
const translate = require("./routes/translate");

//apps
const app = express();


//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(cookieParser());
// app.use(expressValidator());
app.use(cors());


//routes middleware
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',braintreeRoutes);
app.use("/api", orderRoutes);
app.use("/api", mercari);
app.use("/api", rakuten);
app.use("/api", translate);

//database connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => console.log('✔️ Connected to DB'));


//routes
const port = process.env.PORT || 8000;


app.listen(port, () => {
  console.log(`✔️ Server is running on port ${port}`);
});