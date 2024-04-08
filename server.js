const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  //checking for errors before starting the app and connecting with DB
  console.log("UNCAUGHT EXCEPTION!");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });   

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connection successful!");
  })
  .catch((err) => console.error(err));

  
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("app running in port:", port);
});

process.on("unhandledRejection", (err) => {
  //ANY UNHANDLED USER CREATED ERROR IS HANDLED HERE
  console.log("UNHANDLED REJECTION!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
