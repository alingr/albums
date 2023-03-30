import express from "express";
import db from "../db/connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of albums
router.get("/", async (req, res) => {
  let collection = await db.collection("albums");
  let results = await collection.find({})
    .toArray();

  const countDoc = await collection.countDocuments();
  console.log("GET operation result - countDocuments: " + countDoc)
  res.send(results).status(200);
});

// Get a single album
router.get("/:id", async (req, res) => {
  let collection = await db.collection("albums");
  //let query = {artist: req.params.id};
  console.log(req.params.id)
  let query = { album_id: req.params.id };
  let result = await collection.findOne(query);

  if (!result) {
    console.log("GET operation result: " + result)
    res.send("Not found").status(404);
  }
  else res.send(result).status(200);
});

// Add a new document to the collection
router.post("/", async (req, res) => {
  // throw bad request if title is missing from body
  if (req.body.title == null || req.body.title == undefined) {
    res.status(400).send('The title field is required.');
  } else {
    let id = Date.now();
    let collection = await db.collection("albums");
    const doc = {
      album_id: id.toString(),
      title: req.body.title,
      artist: req.body.artist,
      genre: req.body.genre,
      label: req.body.label,
      songs: req.body.songs,
      year: req.body.year,
    }
    let result = await collection.insertOne(doc);
    res.json({ "message": "Album created succesfully", "album_id": doc.album_id }).status(201);
    console.log(`An album was created with the id: ${doc.album_id}`);
  }

});

// Update the entire document 
router.put("/:id", async (req, res) => {
  // create a filter for an album to update
  const filter = { album_id: req.params.id };

  // this option instructs the method to create a document if no documents match the filter
  const options = { upsert: true };

  // create a document that sets the updated data of the album
  const updateDoc = {
    $set: {
      title: req.body.title,
      artist: req.body.artist,
      genre: req.body.genre,
      label: req.body.label,
      songs: req.body.songs,
      year: req.body.year,
    },
  };

  let collection = await db.collection("albums");
  let result = await collection.updateOne(filter, updateDoc);

  console.log("PUT operation result - acknowledged: " + result.acknowledged)
  console.log("PUT operation result - modifiedCount: " + result.modifiedCount)
  console.log("PUT operation result - upsertedId: " + result.upsertedId)
  console.log("PUT operation result - upsertedCount: " + result.upsertedCount)
  console.log("PUT operation result - matchedCount: " + result.matchedCount)
  res.send(result).status(200);
});

// Update specific fields of the document 
router.patch("/:id", async (req, res) => {
  // create a filter for an album to update
  const filter = { album_id: req.params.id };

  // this option instructs the method to create a document if no documents match the filter
  const options = { upsert: true };

  let collection = await db.collection("albums");
  let album = await collection.findOne(filter);
  if (!album) {
    res.status(404).send('The album with the given album_id was not found.');
    console.log("PATH operation failed - album_id " + req.params.id + " not found")
  } else {
    let query = { $set: {} };
    for (let key in req.body) {
      if (album[key] && album[key] !== req.body[key]) // if the field in req.body exists, update it
        query.$set[key] = req.body[key];
    }

    let collection2 = await db.collection("albums");
    let result = await collection2.updateOne(filter, query);

    console.log("PATCH operation result - acknowledged: " + result.acknowledged)
    console.log("PATCH operation result - modifiedCount: " + result.modifiedCount)
    console.log("PATCH operation result - upsertedId: " + result.upsertedId)
    console.log("PATCH operation result - upsertedCount: " + result.upsertedCount)
    console.log("PATCH operation result - matchedCount: " + result.matchedCount)
    res.send(result).status(200);
  }


});

// Delete an entry
router.delete("/:id", async (req, res) => {
  let query = { album_id: req.params.id };

  const collection = db.collection("albums");
  let result = await collection.deleteOne(query);

  console.log("DELETE operation result - acknowledged: " + result.acknowledged)
  console.log("DELETE operation result - deletedCount: " + result.deletedCount)
  res.send(result).status(200);
});

export default router;