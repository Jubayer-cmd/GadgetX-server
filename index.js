const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qygv5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const gadgetCollection = client.db("GadgetX").collection("items");
    console.log("db connected");
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = gadgetCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("Listening to 5000");
});
