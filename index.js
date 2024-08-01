const express = require("express");
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const port = process.env.port || 5000;

// Middelware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.qjq5l6y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // await client.connect();

    const productsCollection = client.db("Beaufly").collection("Products");
    const cartProductCollection = client.db("Beaufly").collection("CartProducts");
    const usersCollection = client.db("Beaufly").collection("users");
    const Brands = client.db("Beaufly").collection("Brands");
    const HotDealsCollection = client.db("Beaufly").collection("HotDealsCollection");

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const query = productsCollection.find();
      const result = await query.toArray();
      res.send(result)
    })

    app.get('/products/:brandName', async (req, res) => {
      const brandName = req.params.brandName;
      // console.log("Brand Name",brandName);
      const query1 = { Bname: brandName }
      const query2 = productsCollection.find(query1);
      const result = await query2.toArray();
      res.send(result);
    })

    // Product Details
    app.get('/products/:brandName/productDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query);
      res.send(result);
    })

    // Cart Product Post
    app.post("/cart", async (req, res) => {
      const cartIn = req.body;
      const result = await cartProductCollection.insertOne(cartIn);
      res.send(result);
    })

    app.get("/cart", async (req, res) => {
      const email = req.query?.email;
      console.log(email);
      let query = {};
      if (req.query?.email) {
         query = {userEmail:email};
      }
      const data =cartProductCollection.find(query);
      const result = await data.toArray();
      res.send(result);
    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      console.log("Deleted Is", id);
      const query = { _id: new ObjectId(id) }
      const result = await cartProductCollection.deleteOne(query);
      res.send(result)
    })

    // Update Data 
    app.get("/products/:brandName/update/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Updates Is", id);
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query);
      res.send(result)
    })

    app.put("/products/:brandName/update/:id", async (req, res) => {
      const id = req.params.id;
      console.log("PUT ID", id);
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const user = req.body;
      console.log(user);
      const updateDoc = {
        $set: {
          image: user.image,
          name: user.name,
          Bname: user.Bname,
          category: user.category,
          price: user.price,
          descri: user.descri,
          rating: user.rating
        }
      }
      const result = await productsCollection.updateOne(query, updateDoc, options);
      res.send(result);

    })


    // Load Brand Data 
    app.get("/brands", async (req, res) => {
      const query = Brands.find();
      const result = await query.toArray();
      res.send(result)
    })

    // Load HOT Deals 
    app.get("/hotDeals", async (req, res) => {
      const query = HotDealsCollection.find();
      const result = await query.toArray();
      res.send(result)
    })


    //Create User 
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    // Send a ping to confirm a successful connection

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Beaufly Shop Server Running")
})

app.listen(port, () => {
  console.log(`Beaufly Listing port ${port}`);
})