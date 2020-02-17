

const fetch = require('node-fetch');
let price = 0.04

exports.listSearch =  async (req, res) => {
  await fetch(`http://178.128.103.89`)
  .then(res => res.json())
  .then(body => {
    price = body;
  });


  fetch(`http://178.128.103.89/pi/mercari/search?page=${req.query.page||1}&search=${req.query.search}&price_min=${req.query.min_price || ""}&price_max=${req.query.max_price || ""}`)
      .then(res => res.json())
      .then(body => { 
        body.forEach(element => {
          if (element.price < (10000*parseFloat(price))) {
            element.price = (parseFloat(element.price)  + (250*parseFloat(price)))
            element.price = (Math.round(element.price * 100) / 100).toFixed(2).toString();
          }else
          element.price = (parseFloat(element.price)  + (400*parseFloat(price))).toFixed(2)
          element.price = (Math.round(element.price * 100) / 100).toFixed(2).toString();
        });
        
        
        res.json(body);
      });
    };


exports.productDeatils =  async (req, res) => {
  await fetch(`http://178.128.103.89`)
  .then(res => res.json())
  .then(body => {
    price = body;
  });

  fetch(`http://178.128.103.89/pi/mercari/product?uri=${req.query.uri}`)
      .then(res => res.json())
      .then(body => {
        if (body.product.price < (10000*parseFloat(price))) {
          body.product.price = (parseFloat(body.product.price)  + (250*parseFloat(price)))
          body.product.price = (Math.round(body.product.price * 100) / 100).toFixed(2).toString();
        }else
        body.product.price = (parseFloat(body.product.price)  + (400*parseFloat(price))).toFixed(2)
        body.product.price = (Math.round(body.product.price * 100) / 100).toFixed(2).toString();

        body.relatedItems.forEach(element => {
          if (element.price < (10000*parseFloat(price))) {
            element.price = (parseFloat(element.price)  + (250*parseFloat(price)))
            element.price = (Math.round(element.price * 100) / 100).toFixed(2).toString();
          }else
          element.price = (parseFloat(element.price)  + (400*parseFloat(price))).toFixed(2)
          element.price = (Math.round(element.price * 100) / 100).toFixed(2).toString();
        });

        
        res.json(body);
      });
    };

   
   
   
    

