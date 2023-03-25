import { MongoClient } from "mongodb";

const username = process.env.db_user;
const password = process.env.db_pass;

const uri = "mongodb+srv://" + username + ":" + password + "@addressbook.f1grx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("music");

export default db;