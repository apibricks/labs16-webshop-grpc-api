products = []

for (var i=0; i < 30; i++) {
  product = {
    id: '' + i,
    name: 'Product ' + i,
    category: 'None',
    producer: 'None',
    weight: Math.random(),
    price: Math.random() * 100
  }
  products.push(product);

}
var fs = require('fs');
fs.writeFile(__dirname + '/products.json', JSON.stringify(products));
