import algoliasearch from 'algoliasearch'; // Corrected import statement

const client = algoliasearch('EXYWXN8Y7A', '83631e73c6c61de62838ee34a8e0fec2');
const index = client.initIndex('products'); // Initialize the index

// Fetch and index objects in Algolia
const processRecords = async () => {
  const datasetRequest = await fetch('https://fakestoreapi.com/products');
  const products = await datasetRequest.json();
  return await index.saveObjects(products, { autoGenerateObjectIDIfNotExist: true }); // Corrected method call and added option
};

processRecords()
  .then(() => console.log('Successfully indexed objects!'))
  .catch((err) => console.error(err));