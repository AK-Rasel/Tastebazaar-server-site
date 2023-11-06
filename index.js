const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.SECRET_USER_NAME}:${process.env.SECRET_PASS}@cluster0.z9hqskk.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // mongodb Collection
    const FoodCollection = client.db('tasteBazaar').collection('foodItems');

    // All Service Dta
    app.get('/api/v1/all-food-items', async(req, res) => {
      const cursor = FoodCollection.find()
      const result = await cursor.toArray()
      res.send(result)
  });
    app.get('/api/v1/all-food-items/:_id', async(req, res) => {
      const id = req.params._id
      const query = {_id : new ObjectId(id)}
      
      const result = await FoodCollection.findOne(query)
      res.send(result)
  });





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/", (req, res) => {
    res.send("Crud is running...");
  });
  
  
app.listen(port, () => {
    console.log(`Simple Crud is Running on port ${port}`);
  });
  
  