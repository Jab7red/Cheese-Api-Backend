// =======================================
//              DEPENDENCIES
// =======================================
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
// =======================================
//         INITIALIZE EXPRESS APP
// =======================================
const app = express();
// =======================================
//        CONFIGURE SERVER SETTINGS
// =======================================
require('dotenv').config();
// =======================================
//       EXPOSE OUR CONFIG VARIABLES
// =======================================
const { MONGODB_URL, PORT = 4000 } = process.env;
// =======================================
//          DATABASE CONNECTION
// =======================================
mongoose.connect(MONGODB_URL);
// =======================================
//    DATABASE CONNECTION ERROR/SUCCESS
// =======================================
const db = mongoose.connection;
db.on('connected', () => console.log('Connected to MongoDB'));
db.on('disconnected', () => console.log('Disconnected from MongoDB'));
db.on('error', (err) => console.log('MongoDB Error: ' + err.message));
// =======================================
//           SET UP CHEESE MODEL
// =======================================
const cheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
}, { timestamps: true });

const Cheese = mongoose.model('Cheese', cheeseSchema);
// =======================================
//               MIDDLEWARE
// =======================================
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
// =======================================
//              TEST ROUTE
// =======================================
app.get('/', (req, res) => {
    res.send('welcome to the cheese api');
});
// =======================================
//                 ROUTES
// =======================================
// INDEX 
app.get('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});
// CREATE 
app.post('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.json(400).json(error);   
    }
});
// UPDATE 
app.put('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true} ));
    } catch (error) {
        res.json(400).json(error);
    }
});
// DELETE 
app.delete('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.json(400).json(error);
    }
});
// =======================================
//              APP LISTENER
// =======================================
app.listen(PORT, () => {
    console.log(`Express is listening on port: ${PORT}`);
});
