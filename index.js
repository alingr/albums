import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//import "express-async-errors";
import albums from "./src/routes/albums.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// use swagger page as start page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use('/assets', express.static(__dirname + '/public'));

const currentTime = new Date()
const year = currentTime.getFullYear()

app.use("/", function(req, res){
  res.render('index', { year : year });
});

// Load the /albums routes
app.use("/albums", albums);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});