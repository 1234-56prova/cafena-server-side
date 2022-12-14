const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fqoju.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const coffeeCollection = client.db('cafena').collection('coffees');
        const cartCollection = client.db('cafena').collection('cart');

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.get('/coffees', async (req, res) => {
            const query = {};
            const result = await coffeeCollection.find(query).toArray();
            res.send(result);
        })

        // cart apis

        app.post('/cart', async (req, res) => {
            const cart = req.body;
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        });

        app.get('/cart', async (req, res) => {
            const query = {};
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Look Mama! I can code node now')
})

app.listen(port, () => {
    console.log('Listening to port', port);
})
