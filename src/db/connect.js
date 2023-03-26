import { MongoClient } from "mongodb";

const username = process.env.db_user;
const password = process.env.db_pass;

// Create connection string
const uri = "mongodb+srv://" + username + ":" + password + "@addressbook.f1grx.mongodb.net/?retryWrites=true&w=majority";

// Create client
const client = new MongoClient(uri);

// Create DB connection
let connection;
try {
  connection = await client.connect();
} catch(e) {
  console.error(e);
}

// Connect to music connection
let db = connection.db("music");

export default db;