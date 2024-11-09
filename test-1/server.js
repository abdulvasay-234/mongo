const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/test')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Create a schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('Home'));

// Register route
app.post('/register', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email
    });

    newUser.save() // This returns a promise, no need for callback
        .then(() => res.send('Successfully registered!'))
        .catch((err) => res.send(err.message));
});

// Async/Await Example (Pick one method, not both)
app.post('/save', async (req, res) => {
    try {
        const myData = new User(req.body); // Assuming you're saving user data
        await myData.save();  // Wait for save to finish
        res.status(200).send('Data saved');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// OR, Promise-based syntax (alternative method)
app.post('/save', (req, res) => {
    const myData = new User(req.body);
    myData.save() // This returns a promise
        .then(() => res.status(200).send('Data saved'))
        .catch((err) => res.status(500).send(err.message));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
