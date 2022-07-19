// Server
require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  process.stdout.write(`App running on port ${port}\n`);
});
