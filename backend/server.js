const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const environment = require('./environment');

const app = express();
const port = environment.port;
const projectData = [];

function logger(req, res, next) {
  console.log('Request!', 'method', req.method, 'pathname', req.url);
  next();
}

function makeResponsePayload(data) {
  return { success: true, data }
}
app.use(logger, bodyParser.json(), cors());

app.get(
  '/weather',
  (req, res, next) => req.query && req.query.location ? next() : res.status(400).json({ error: 'missing location query parameter' }),
  async (req, res) => {
    function makeAPIEndpoint(location) {
      const { apiKey, apiBaseUrl } = environment;
      return `${apiBaseUrl}?q=${location}&APPID=${apiKey}`;
    }

    async function queryAPI(apiUrl) {
      const APIResponse = await fetch(apiUrl);
      return APIResponse.json();
    }

    const apiUrl = makeAPIEndpoint(req.query.location);
    const apiResponse = await queryAPI(apiUrl);
    if (apiResponse.cod === '404') {
      res.status(404).send();
      return;
    }
    res.json(makeResponsePayload(apiResponse));
  }
);

app.post(
  '/entry',
  (req, res, next) => req.body && req.body.weather && req.body.feelings ? next() : res.status(400).json({ error: 'request body incomplete' }),
  (req, res) => {
    const { feelings, weather } = req.body;
    const newEntry = { feelings, weather, created: new Date().toISOString() };
    projectData.push(newEntry);
    res.status(201).json(makeResponsePayload(newEntry));
  }
);

app.use(express.static('./website'));
app.listen(port, () => console.log(`server listening on port ${port}`));
