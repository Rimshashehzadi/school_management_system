const app = require("./src/app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`SERVER STARTED: http://localhost:${PORT}`);
});