//Install express server
const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./routes');

const PORT = process.env.PORT || 3000;
const app = express();

// Serve only the static files form the dist directory
const publicPath = path.join(__dirname, '../client/dist/dishygraph');
const localPath = path.join(__dirname, '../client/src');
app.use(cors());
app.use(express.static(localPath));
app.use(express.json());
//app.get('/*', (req, res) =>
//  res.sendFile('index.html', {
//    root: localPath,
//  })
//  );
app.use('/api', router);
// Start the app by listening on the default Heroku port
app.listen(PORT, () => {
  `Server listening to port ${PORT}`;
});
