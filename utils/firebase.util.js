const { initializeApp } = require('firebase/app');
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require('firebase/storage');
const dotenv = require('dotenv');

//Models
const { ProductImg } = require('../models/productImg.model');

dotenv.config({ path: './config.env' });

//Web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_APP_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//Storage firebase service
const storage = getStorage(firebaseApp);

const uploadPostImgs = async (imgs, productId) => {
  //Map async ->  Async operations with arrays, map, filter
  const imgsPromises = imgs.map(async (img) => {
    //Create firebase refrerence
    const [originalname, ext] = img.originalname.split('.');
    const filename = `products/${productId}/${originalname}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);

    //Uplead image to Firebase
    const result = await uploadBytes(imgRef, img.buffer);

    await ProductImg.create({
      productId,
      imgUrl: result.metadata.fullPath,
    });
  });
  await Promise.all(imgsPromises);
};

const getProductsImgsUrls = async (products) => {
  // Loop trough products to get to the postImgs
  const productsImgsPromises = products.map((product) =>
    getProductImgsUrls(product)
  );
  return await Promise.all(productsImgsPromises);
};

const getProductImgsUrls = async (product) => {
  // Get img URLs
  const productImgsPromises = product.productImgs.map(async (productImg) => {
    const imgRef = ref(storage, productImg.imgUrl);
    const imgUrl = await getDownloadURL(imgRef);
    productImg.imgUrl = imgUrl;
    return productImg;
  });
  // Resolve imgs URLS
  const productImgs = await Promise.all(productImgsPromises);
  product.productImgs = productImgs;
  return product;
};

module.exports = {
  storage,
  uploadPostImgs,
  getProductsImgsUrls,
  getProductImgsUrls,
};
