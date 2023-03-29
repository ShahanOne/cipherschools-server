require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('mongoose-type-url');
mongoose.set('strictQuery', false);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const validator = require('validator');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
const cors = require('cors');
const { json } = require('body-parser');
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//Connection
mongoose.connect(
  //   'mongodb://localhost:27017/cipherSchoolsDB'
  `mongodb+srv://Shahan786:${process.env.MONGO_PASSWORD}@cluster0.ma0c6.mongodb.net/cipherSchoolsDB`
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'invalid email'],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: String,
  interests: [],
  followers: [],
  linkedin: String,
  facebook: String,
  instagram: String,
  twitter: String,
  website: String,
  github: String,
  education: String,
  college: String,
});

//Model
const User = mongoose.model('User', userSchema);

// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post('/web-info', (req, res) => {
  const data = req.body[0];
  const userId = data.userId;
  const linkedin = data.linkedin;
  const facebook = data.facebook;
  const github = data.github;
  const instagram = data.instagram;
  const twitter = data.twitter;
  const website = data.website;

  // console.log(data);

  User.findOne({ _id: userId }, (err, foundUser) => {
    User.findOneAndUpdate(
      { _id: foundUser._id },
      {
        linkedin: linkedin,
        facebook: facebook,
        instagram: instagram,
        github: github,
        twitter: twitter,
        website: website,
      },
      { returnOriginal: false },
      (err, updatedUser) => {
        !err
          ? res.send(JSON.stringify(updatedUser)) && console.log('done')
          : res.send('poop') && console.log(err);
      }
    );
  });
});

app.post('/about', (req, res) => {
  const data = req.body[0];
  const userId = data.userId;
  const newAbout = data.about;

  User.findOne({ _id: userId }, (err, foundUser) => {
    User.findOneAndUpdate(
      { _id: foundUser._id },
      {
        about: newAbout,
      },
      { returnOriginal: false },
      (err, updatedUser) => {
        !err
          ? res.send(JSON.stringify(updatedUser)) && console.log('done')
          : res.send('poop') && console.log(err);
      }
    );
  });
});

app.post('/personal-info', (req, res) => {
  const data = req.body[0];
  const userId = data.userId;
  const education = data.education;
  const college = data.college;

  // console.log(data);

  User.findOne({ _id: userId }, (err, foundUser) => {
    User.findOneAndUpdate(
      { _id: foundUser._id },
      {
        education: education,
        college: college,
      },
      { returnOriginal: false },
      (err, updatedUser) => {
        !err
          ? res.send(JSON.stringify(updatedUser)) && console.log('done')
          : res.send('poop') && console.log(err);
      }
    );
  });
});

app.post('/new-password', (req, res) => {
  const data = req.body[0];
  const userId = data.userId;
  const newPassword = data.password;

  bcrypt.hash(newPassword, saltRounds, function (err, hash) {
    User.findOne({ _id: userId }, (err, foundUser) => {
      User.findOneAndUpdate(
        { _id: foundUser._id },
        {
          password: hash,
        },
        { returnOriginal: false },
        (err, updatedUser) => {
          !err
            ? res.send(JSON.stringify(updatedUser)) && console.log('done')
            : res.send('poop') && console.log(err);
        }
      );
    });
  });
});

app.post('/login', (req, res) => {
  const data = req.body[0];
  const username = data.username;
  const password = data.password;
  // console.log(data);
  User.findOne({ username: username }, (err, foundUser) => {
    !err && foundUser
      ? bcrypt.compare(password, foundUser.password, (err, result) =>
          !err && result
            ? res.send(JSON.stringify(foundUser))
            : console.log(err + 'poop')
        )
      : res.send(JSON.stringify('poop'));
  });
});
app.post('/register', (req, res) => {
  const data = req.body[0];
  const username = data.username;
  const email = data.email;
  const password = data.password;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    const newUser = new User({
      username: username,
      email: email,
      password: hash,
    });

    newUser.save((err) => {
      //password will be encrypted now
      if (!err) {
        console.log(newUser);
        // res.send(JSON.stringify(username));
      } else {
        console.log(err);
      }
    });
  });
});

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Server started on port 3001');
});
