const express = require('express');
const sgMail = require('@sendgrid/mail');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.post('/send-email', (req, res) => {

    const { name, email, phone, message } = req.body.userContact;

    const msg = {
        to: 'Asingh@sbconsultantllc.com',
        from: process.env.SENDER_EMAIL,
        subject: 'Contact Information',
        text: `User Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };



    sgMail.send(msg)
        .then(() => {
            console.log('Email sent successfully', msg.to);
            res.status(200).send('Email sent successfully');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
