const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  port: process.env.PORT,
  apiBaseUrl: process.env.API_BASEURL,
  apiKey: process.env.API_KEY
};
