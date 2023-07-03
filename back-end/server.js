const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json');
const app = express();
const cors = require('cors');

const port = config.env.test.PORT || 8080;

// import routes
const users = require('./server/routes/user-routes');
const items = require('./server/routes/item-routes');
const dashboard = require('./server/routes/dashboard-routes');
const bills = require('./server/routes/bill-routes');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,access-control-allow-origin");
  next();
});

// Routes
app.use('/user', users);
app.use('/item', items);
app.use("/dashboard", dashboard);
app.use("/bills",bills);

app.listen(port, () => {
  console.log('Server started on port ' + port);
});