const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config({path: __dirname+'/.env'})

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//use cors to allow cross origin resource sharing
app.use(cors());

const mySecret = process.env['MONGO_URI']
const mongoose = require('mongoose');
//connecting to the database
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
const state = db.readyState;
// a state = 2 means the DB is connecting
console.log(state===2?"connecting to database...":"connection failed!");
//crete schema and model for incoming messages
const Schema = mongoose.Schema;

let emailSchema = new Schema({
  Datum: { type: Date, default: new Date() },
  Name: { type: String },
  Email: { type: String },
  Message: { type: String }
});

let contacts = mongoose.model('contacts', emailSchema);

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//let's add some transport to send an automatic email reply
const mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env['MAIL_USER'],
        pass: process.env['MAIL_TOKEN']
    }
});

app.post('/posts',(req,res)=>{

    const { name, email, message} = req.body;

    const document = new contacts({
        Name: name,
        Email: email,
        Message: message
    });

    document.save((err,data)=>{
        if (err) console.log(err);
        console.log(data);
    });

    const reply = '<h2 style="font-family: sans-serif; color: purple">Thank you for your message!</h2>'
    +'<p style="font-family: sans-serif">Please do not reply to this Email. I will be in touch as soon as possible to attend to your inquiry.<br><br>Kind regards,<br><br>Sebastian Arenas</p><br>'
    +'<p style="font-family: courier">E-Mail: sebasa_p@outlook.com<br>https://nameless-lowlands-50854.herokuapp.com/</p>';
    
    mailTransport.sendMail({
        from: '"Sebastian Arenas"'+'<'+process.env.MAIL_USER+'>',
        to: email,
        subject: 'Your Email Confirmation',
        html: 'Hello '+name+','+reply}, (err)=>{
        if (err){console.log(err);}
    });

    res.redirect(303,'/');
});

app.listen(port,(err)=>{
    if (err) return console.log(err);
    console.debug("Server up and running on port", port);
});