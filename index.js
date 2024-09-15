require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgokw2y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  // await client.connect();
  try {
    const db = client.db("campease");
    const productCollection = db.collection("Products");

    app.get("/products", async (req, res) => {
      try {
        const products = await productCollection.find({}).toArray();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: "Failed to retrieve products" });
      }
    });

    app.get("/manage", async (req, res) => {
      try {
        const products = await productCollection.find({}).toArray();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: "Failed to retrieve products" });
      }
    });

    app.get("/product/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      try {
        const product = await productCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ error: "Failed to retrieve product" });
      }
    });

    app.post("/manage", async (req, res) => {
      const newProduct = req.body;
      try {
        const result = await productCollection.insertOne(newProduct);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to add product" });
      }
    });

    app.put("/manage/:id", async (req, res) => {
      const { id } = req.params;
      const updatedProduct = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      try {
        const result = await productCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedProduct }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
      }
    });

    app.delete("/manage/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      try {
        const result = await productCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
      }
    });

    // Update product status (optional status management route)
    app.put("/product/:id", async (req, res) => {
      const { id } = req.params;
      const updatedProduct = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      try {
        const result = await productCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedProduct }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
      }
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello campease!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
