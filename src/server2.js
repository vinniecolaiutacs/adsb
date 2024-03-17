const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/api/data', async (req,res) =>{
    await axios.get('https://api.adsb.one/v2/type/A321')
    .then(response => {res.json(response.data)})
    .catch(error => {res.status(500).send('Error fetching data from API') });
});

app.listen(port, () => {
    console.log('Listening');
});