var PROTO_PATH = __dirname + '/webshop.proto';

var grpc = require('grpc');
var webshop_proto = grpc.load(PROTO_PATH).webshop;

var customer = {
  id: "1",
  firstname: "Alfred",
  lastname: "Einstein",
  shippingAddress: "Zielstraße 42, 00000 Destination",
  paymentDetails: "VISA 2345-3241-4633-1234"
};
var order = {
  products: [{id: "1"},{id: "2"}],
  customer: customer,
  status: "NEW"
};

function main() {
  var client = new webshop_proto.WebShop('localhost:50051',
                                         grpc.credentials.createInsecure());

  var call = client.listProducts({limit: 10});
  call.on('data', function(product) {
    console.log('Received product: ' + product.id + '  ' + product.name);

  });
  call.on('end', function() {});
  client.checkAvailability({id:'1'}, function(err, response) {
    if (err) {
      console.log(err.message);
    } else {
      if (response.available) {
        console.log('Product is available');
      } else {
        console.log('Product is unavailable');
      }
    }
  });
  client.checkAvailability({id:'-1'}, function(err, response) {
    if (err) {
      console.log(err.message);
    } else {
      if (response.available) {
        console.log('Product is available');
      } else {
        console.log('Product is unavailable');
      }
    }
  });

  client.storeOrderDetails(order, function(err, response) {
    console.log('Stored Order: ', response);
    var orderId = response.id;

    client.getOrderDetails({id: orderId}, function(err, response) {
      if (err) {
        console.log(err.message);
      } else {
        console.log('Retrieved Orderdetails: ', response);
      }
    });

    client.cancelOrder({id: orderId}, function(err, response) {
      if (err) {
        console.log(err.message);
      } else {
        console.log('Canceled Order: ', response);
      }
    })
  });

  // Callback Hell :) .. Quick 'N Dirty
  client.storeOrderDetails(order, (err, response) => {
    console.log('Stored Order: ', response);
    var orderId = response.id;

    client.calcTransactionCosts({id: orderId}, (err, response) => {
      var transactionCosts = response.costs;
      client.calcTransactionCosts({id: orderId}, (err, response) => {
        var shipmentCosts = response.costs;
        client.conductPayment({id: {id: orderId}, amount: shipmentCosts + transactionCosts}, (err, response) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log('Payment succeeded: ', response);
            client.shipProducts({id: orderId}, (err, response) => {
              if(err) {
                console.log(err.message);
              } else {
                console.log("Products Shipped ", response);
              }
            })
          }
        });
      });
    });
  });
}

main();
