const express = require('express');
const app = express();

const cors = require('cors');
const {CLIENT_ORIGIN, PORT} = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get('/money', (req,res) => {
    res.json({Hozefa: message})
})

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});



app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};