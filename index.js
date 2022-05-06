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
    console.log("DB connected");

    //findall
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = gadgetCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    //findone
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await gadgetCollection.findOne(query);
      res.send(service);
    });

    //update delivery
    app.patch("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updatedGadgets = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedGadgets?.newQuantity,
        },
      };
      const result = await gadgetCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //post
    app.post("/additems", async (req, res) => {
      const newUser = req.body;
      const result = await gadgetCollection.insertOne(newUser);
      res.send(result);
    });

    // DELETE
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await gadgetCollection.deleteOne(query);
      res.send(result);
    });
    //check orders
    app.get("/order", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = gadgetCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("Listening to 5000");
});
