const express = require('express')
const path = require('path')
const body = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/siksha', {useNewUrlParser: true, useUnifiedTopology: true})
const app = express();

var http = require('http').createServer(app)
const fs = require('fs')
const PORT = process.env.PORT || 6005

//DataBase Dafine
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String, 
    desc: String
});

var Contact = mongoose.model('Contact', contactSchema);

//Express Stuff and static file
app.use('/static', express.static('static'));
app.use(express.urlencoded());

//Engine (PUG) Stuff
app.set('views', path.join(__dirname, 'views')); //set the views directory
app.set('view engine', 'pug');


// Endpoints
app.get('/', (req, res)=>{
    res.status(200).render('home.pug');
});

app.get('/contact', (req, res)=>{
    res.status(200).render('contact.pug');
});

app.post('/contact', (req, res)=>{
    var data = new Contact(req.body);
    data.save().then(()=>{
        res.send("Item has been Saved to the database");
        fs.appendFile('csv/message.txt', data, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });        
    }).catch(()=>{
        res.status(400).send("Item has not been saved");
    });
})


//Starting the Server
app.listen(PORT, ()=>{
    console.log(`Application is started successfully on the port ${PORT}`);
})