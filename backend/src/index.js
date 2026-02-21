require('dotenv').config();

const app = require('./app');
const config = require('./config');

const port = config.port;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
