//Install express server
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(path.join(__dirname,'../client/dist/dishygraph')));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {
    root: path.join(__dirname, '../client/dist/dishygraph'),
  })
);

// Start the app by listening on the default Heroku port
app.listen(PORT, () => {
  `Server listening to port ${PORT}`
});
