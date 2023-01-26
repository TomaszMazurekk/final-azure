const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://azure-final-db:aoVpssWBiA2sarUZTPvoe4MMfYH72DtfswvSqjKfjeJNcXTGH7JdTmSRytvf6OVddNPPwRtcTg87ACDb8KltFQ==@azure-final-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@azure-final-db@';
const client = new MongoClient(url);
const app = express();
const dbName = 'tomusMazurek';
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('posts');
  const posts = await collection.find({}).toArray();
  res.render('index', {posts});
})

app.post('/add', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('posts');
  const post = req.body;
  const result = await collection.insertOne(post);
  res.send(result);
})

app.get('/update/:id', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('posts');
  const _id = new ObjectId(req.params.id);
  const post = await collection.findOne({_id});
  res.render('update', {post});
})

app.put('/update/:id', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('posts');
  const _id = new ObjectId(req.params.id);
  const result = await collection.updateOne({_id}, { $set: req.body }, { upsert: true });
  res.send(result);
})

app.delete('/delete/:id', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('posts');
  const _id = new ObjectId(req.params.id);
  const result = await collection.deleteOne({_id});
  res.send(result);
})

const connect = async () => {
  await client.connect();
}
connect();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
