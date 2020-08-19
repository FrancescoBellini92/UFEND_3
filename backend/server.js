const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const projectData = [];

function makeAPIEndpoint(location) {
  const API_KEY = '909a710b570d3d326d15cfa247a2bc62';
  const API_BASEULR = 'https://api.openweathermap.org/data/2.5/weather'
  return `${API_BASEULR}?q=${location}&APPID=${API_KEY}`
}

function logger(req, res, next) {
  console.log('Request!', 'method', req.method, 'pathname', req.url);
  next();
}

app.use(logger, bodyParser.json(), cors());

app.get('/weather', async (req, res) => {
  const apiUrl = makeAPIEndpoint(req.query.location)
  const JSONResponse = await queryAPI(apiUrl);
  console.log('Response', JSONResponse);
  res.json(JSONResponse)
});

app.post('/feelings', (req, res) => {
  const feelingData = req.body;
  projectData.push(feelingData);
  console.log(feelingData);
  res.status(201).send();
});

app.use(express.static('./website'));
app.listen(port, () => console.log(`server listening on port ${port}`));

async function queryAPI(apiUrl) {
  const APIResponse = await fetch(apiUrl);
  return APIResponse.json();
}
