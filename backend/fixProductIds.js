// fixProductIds.js (for ES modules)
import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb://localhost:27017"; // Change if needed
const dbName = "ecommerce";

async function fixProductIds() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const productsCol = db.collection('products');
    const ordersCol = db.collection('orders');

    // Step 1: Fetch all products
    const products = await productsCol.find().toArray();

    // Step 2: Map old string _id to new ObjectId
    const idMap = {};
    for (const product of products) {
      if (typeof product._id === 'string') {
        const newId = new ObjectId();
        idMap[product._id] = newId;

        // Remove old product and insert with new ObjectId
        const { _id, ...rest } = product;
        await productsCol.deleteOne({ _id });
        await productsCol.insertOne({ _id: newId, ...rest });
      }
    }

    // Step 3: Update productId in orders
    const orders = await ordersCol.find().toArray();

    for (const order of orders) {
      let changed = false;
      const updatedProducts = order.products.map(p => {
        if (typeof p.productId === 'string' && idMap[p.productId]) {
          changed = true;
          return { ...p, productId: idMap[p.productId] };
        }
        return p;
      });

      if (changed) {
        await ordersCol.updateOne(
          { _id: order._id },
          { $set: { products: updatedProducts } }
        );
      }
    }

    console.log("✅ Product IDs updated to ObjectId in both products and orders.");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

fixProductIds();
