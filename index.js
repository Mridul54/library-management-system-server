const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wucyw0m.mongodb.net/?retryWrites=true&w=majority`;

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

    const bookCategoryCollection = client.db('bookCategory').collection('category');

    const bookCollection = client.db('bookDB').collection('book');

    app.get('/category', async(req, res) => {
        const cursor = bookCategoryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/category/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await bookCategoryCollection.findOne(query);
        res.send(result);
    })

    

    app.post('/book', async(req, res) => {
        const newBook =req.body;
        console.log(newBook);
        const result = await bookCollection.insertOne(newBook);
        res.send(result);
    })

    app.get('/book', async(req, res) => {
        const cursor = bookCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/book/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await bookCollection.findOne(query);
        res.send(result)
    })

    app.put('/book/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true};
        const updatedBook = req.body;
        const book = {
            $set: {
                photo: updatedBook.photo, 
                name: updatedBook.name, 
                quantity: updatedBook.quantity, 
                author: updatedBook.author, 
                category: updatedBook.category, 
                description: updatedBook.description, 
                rating: updatedBook.rating
            }
        }
        const result = await bookCollection.updateOne(filter, book, options);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('library is awesome')
})

app.listen(port, () => {
    console.log(`Library Server is running on port ${port}`)
})