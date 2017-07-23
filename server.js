const express = require('express');
const leaflet = require('leaflet');

const PORT = process.env.PORT || 3000;
const app = express();

const server = app.listen(() => {
  console.log(`Server listening on ${PORT}`);
});
