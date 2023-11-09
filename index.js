const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
// app.use(cors({
//   origin:[
//     'https://tastebazaar-2.web.app',
//     'https://tastebazaar-2.firebaseapp.com'
//   ]
// }))
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// secret
const tokenSecret = "ar_valo_lage_na_ar_code!kiarbolbo"

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
    const purchaseCollection = client.db('tasteBazaar').collection('purchase');

    // verify token
    const watchmen = (req, res, next) => {
      const { token } = req.cookies
      // if cna hoi
      if (!token) {
        return res.status(401).send({ Message: 'You ar not authorized' })
      }
      // verify a token symmetric
      jwt.verify(token, tokenSecret, function (err, decoded) {
        if (err) {
          return res.status(401).send({ Message: 'You ar not authorized' })
        }
        req.user = decoded
        next()
      });
    }
  // All service user specific order get
  app.get('/all-food-items', async (req, res) => {
    // console.log(req.query.email)
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email }
    }
    const result = await FoodCollection.find(query).toArray()
    res.send(result)
  })

    // All Service Data
    app.get('/all-food-items', async (req, res) => {
      const cursor = FoodCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    });
    
       // paginetion
       app.get('/all-food-items-count',async(req,res) =>{
        const pageCount = await FoodCollection.estimatedDocumentCount()
        res.send({pageCount})
       })


     //  single pages data
     app.get("/all-food-items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await FoodCollection.findOne(query);
      res.send(result)
    })

    // update
    
    
    // Add food
    app.post('/all-food-items', async (req, res) => {
      const addFoodData = req.body;
      console.log(addFoodData)
      const result = await FoodCollection.insertOne(addFoodData)
      res.send(result)

    })
    // app.patch('/all-food-items/:id', async(req, res) => {
    //   const id = req.params.id
    //   const updateAddFood = req.body
    //   const filter = {_id : new ObjectId(id)}
    //   console.log(updateAddFood)
    //   const updateDoc ={
    //     $set:{
    //       status: updateAddFood.status
    //     }
    //   }
    // })
  


   
    // purchase get
    app.get('/all-food-items/purchase-detail/:id', async (req, res) => {
      // console.log(req.params)
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await FoodCollection.findOne(query)
      res.send(result)
    });

    // purchase post
    app.post('/purchase', async (req, res) => {
      const purchaseData = req.body;
      console.log(purchaseData)
      const result = await purchaseCollection.insertOne(purchaseData)
      res.send(result)

    })
 
     
   
    // user specific order get
    app.get('/purchase', async (req, res) => {
      // console.log(req.query.email)
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await purchaseCollection.find(query).toArray()
      res.send(result)
    })
    app.put("/purchase/:id",async(req,res)=> {
      console.log(req.params)
    })

    // Ordered delete
    app.delete('/purchase/:id',async (req,res) => {
      const id = req.params.id
      
      const query = {_id: new ObjectId(id)}
      const result = await purchaseCollection.deleteOne(query)
      res.send(result)
    })

    


    // user specific my-added-food-items
    // app.get('/user/my-added-food-items/', async (req, res) => {
    //   // console.log(req)
    //   const queryEmail = req.query.email;
    //   const emailToken = req.user.email

    //   // // match email
    //   if (queryEmail !== emailToken) {

    //     return res.status(403).send({ message: 'forbidden access' })
    //   }

    //   let query = {}
    //   if (queryEmail) {
    //     query.email = queryEmail
    //   }

    //   const result = await purchaseCollection.find(query).toArray()
    //   res.send(result)
    // })


    // user
    // app.delete('/user/delete-food-item/:id', async (req, res) => {
    //   const id = req.params.id
    //   const query = { _id: new ObjectId(id) }
    //   const result = await purchaseCollection.deleteOne(query)
    //   res.send(result)
    // })
    // token client
    // app.post('/auth/token', (req, res) => {
    //   const user = req.body
    //   const token = jwt.sign(user, tokenSecret, { expiresIn: 60 * 60 })
    //   res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: 'none'
    //   }).send({ success: true })
    // })



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

