require('dotenv').config();

let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Initialise the app
let app = express();

// Import routes
let apiRoutes = require("./user/routes/api-routes");

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
mongoose.connect(process.env.DB_LOCALHOST, { useNewUrlParser: true });
var db = mongoose.connection;

// Added check for DB connection
if (!db)
    console.log("Lỗi kết nối")
else
    console.log("Kết nối DB thành công")

// Setup server port
var port = process.env.PORT;

// Use Api routes in the App
app.use('/api', apiRoutes);

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Chạy RestHub trên cổng " + port);
});

// Initialize express router
let router = require('express').Router();

// Export API routes
module.exports = router;