const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");
// const data = require("./data/seyond.json");
const ObjectId = require("mongodb").ObjectId;
var cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let fireIncidentsCollection;
let vehiclesCollection;

// API to get list of fire incidents
app.get("/api/fire-incidents", async (req, res) => {
  const incidents = await fireIncidentsCollection.find().toArray();
  res.json(incidents);
});
// API to get a fire incident by id
app.get("/api/fire-incidents/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const incident = await fireIncidentsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving incident", error });
  }
});

// API to upload a fire incident
app.post("/api/fire-incidents", async (req, res) => {
  const result = await fireIncidentsCollection.insertOne(req.body);
  res.status(201).json(result);
});

// API to update a fire incident
app.put("/api/fire-incidents/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await fireIncidentsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  res.json(result);
});

// API to delete a fire incident
app.delete("/api/fire-incidents/:id", async (req, res) => {
  const { id } = req.params;
  await fireIncidentsCollection.deleteOne({ _id: new ObjectId(id) });
  res.status(204).send();
});

// API to insert vehicle
app.post("/api/vehicles", async (req, res) => {
  const result = await vehiclesCollection.insertOne(req.body);
  res.status(201).json(result);
});

// API to get vehicles
app.get("/api/vehicles", async (req, res) => {
  const vehicles = await vehiclesCollection.find().toArray();
  res.json(vehicles);
});

// API to update a vehicle
app.put("/api/vehicles/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await vehiclesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  res.json(result);
});

// API to delete a vehicle
app.delete("/api/vehicles/:id", async (req, res) => {
  const { id } = req.params;
  await vehiclesCollection.deleteOne({ _id: new ObjectId(id) });
  res.status(204).send();
});

app.use(express.static(path.join(__dirname, "client", "dist")));

// Catch-all route to serve index.html for single-page applications
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(port, "localhost", async () => {
  console.log(`Chatbot server running at http://localhost:${port}`);
  await connectToDatabase();
});

const url =
  "mongodb+srv://admin:ZaZS47xubKUR7ORI@firecluster1.njfnk.mongodb.net/?retryWrites=true&w=majority"; //Please enter yoor mongodb uri here!
const client = new MongoClient(url);
const dbName = "fireline";
const db = client.db(dbName);

async function connectToDatabase() {
  try {
    await client.connect();
    fireIncidentsCollection = db.collection("fireIncidents");
    vehiclesCollection = db.collection("vehicles");
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
