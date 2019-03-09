const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const { Title } = require('./title.model.js');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const cors = require('cors');
const {CLIENT_ORIGIN, PORT, DATABASE_URL, TEST_DATABASE_URL} = require('./config');
//log HTTP layer
app.use(morgan('common'));
//Body Parsing Middleware
app.use(express.json());
//Public Assets
app.use(express.static('public'));
app.use(cors({origin: CLIENT_ORIGIN}));

app.get('/money', (req,res) => {
    res.json({"DRINK": "DRINK"})
})

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

mongoose.Promise = global.Promise;

//SUBMIT A TITLE
app.post('/addtitle', jsonParser ,(request, response) => {
    const newTitle = {
        title: request.body.title
    };
    Title.create(newTitle)
        .then(newTitle => {return response.json(newTitle)})
});

app.get('/jumpy',(request, response) => {
    Title.find()
        .then(titles => {
            return response.json(titles.map(title => title.serialize()))
        })
})

let server;

// SERVER SETUP
function startServer(testEnv) {
    return new Promise((resolve, reject) => {
        let databaseUrl;
  
        if (testEnv) { //testEnv is a boolean passed true when we are using the testing database
            databaseUrl = TEST_DATABASE_URL;
        } else {
            databaseUrl = DATABASE_URL;
        }
        mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
            if (err) {
                console.error(err);
                return reject(err);
            } else {
                server = app.listen(PORT, () => {
                    console.log(`Express server listening on http://localhost:${PORT}`);
                    resolve();
                }).on('error', err => {
                    mongoose.disconnect();
                    console.error(err);
                    reject(err);
                });
            }
        });
    });
  }
  
  function stopServer() {
    return mongoose
        .disconnect()
        .then(() => new Promise((resolve, reject) => {
            server.close(err => {
                if (err) {
                    console.error(err);
                    return reject(err);
                } else {
                    console.log('Express server stopped.');
                    resolve();
                }
            });
        }));
  }
  
  if (require.main === module) {
    startServer().catch(err => console.error(err));
  }
  
  module.exports = { startServer, app, stopServer };