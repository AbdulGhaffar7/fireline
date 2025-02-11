const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let fireIncidentsCollection;
let vehiclesCollection;

// Add this middleware before your API routes:
app.use(async (req, res, next) => {
  // If either collection is not defined, wait for the connection
  if (!fireIncidentsCollection || !vehiclesCollection) {
    await connectToDatabase();
  }
  next();
});

// API to get list of fire incidents
app.get("/api/fire-incidents", async (req, res) => {
  const incidents = await fireIncidentsCollection?.find().toArray();
  res.json(incidents);
});

// API to get a fire incident by id
app.get("/api/fire-incidents/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const incident = await fireIncidentsCollection?.findOne({
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
  const vehicles = await vehiclesCollection?.find().toArray();
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

// Serve static files for your client app
app.use(express.static(path.join(__dirname, "../", "client", "dist")));

// Catch-all route to serve index.html for your SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "client", "dist", "index.html"));
});

// MongoDB connection setup
const url =
  "mongodb+srv://abdul:QkRJ8a3sbbzI53au@test.i8aw1.mongodb.net/?retryWrites=true&w=majority&appName=test";
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

// If not deployed on Vercel, start the server normally for local testing.
if (false && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    connectToDatabase();
  });
} else {
  // When deployed on Vercel, call the database connection during cold start.
  connectToDatabase();
}

// Export the app so Vercel can handle HTTP requests.
module.exports = app;
