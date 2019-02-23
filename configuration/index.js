/**
  * This module is used to collect all the configuration variables,
  * like the environment vars, in one place so they are not scattered all over the whole codebase
*/
require('dotenv').config();


const config = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
};

module.exports = config;
