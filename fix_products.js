const mongoose = require('./backend/node_modules/mongoose');
const Product = require('./backend/src/models/Product');

async function fixStatus() {
  await mongoose.connect('mongodb://localhost:27017/hyperscale_saas');
  await Product.updateMany({}, { status: 'active' });
  const count = await Product.countDocuments({ status: 'active' });
  console.log('Active products count in MongoDB:', count);
  await mongoose.disconnect();
}

fixStatus().catch(console.error);

