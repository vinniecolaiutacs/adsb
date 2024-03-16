const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors')

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

app.get('/api/data', async (req, res) => {
  try {
    const apiResponse = await axios.get('https://api.adsb.one/v2/type/A321');
    const data = apiResponse.data;
    res.set('Access-Control-Allow-Origin', 'https://vinniecolaiutacs.github.io');
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});