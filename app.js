const express = require('express');
const app = express();
const port = 3000;

// Test Route
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
