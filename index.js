const express = require("express");
const app = express();


// middleware
require("dotenv").config();

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
const corsOptions = { allowedHeaders: ["Content-Type","Authorization"] };
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded ({extended:false}));


// temp dev body logger
app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
    next();
});


// api
const apiRouter = require("./api/index")
app.use("/api", apiRouter);


// db
const { client } = require("./db/index");
client.connect();


const PORT = 3001;
app.listen(PORT, () => {
    console.log("We are now running on port", PORT);
});