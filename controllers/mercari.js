

const fetch = require('node-fetch');


exports.listSearch =  async (req, res) => {
  await fetch(`https://jombeli.ngrok.io/pi/mercari/search?page=${req.query.page||1}&search=${req.query.search}&price_min=${req.query.min_price || ""}&price_max=${req.query.max_price || ""}`)
      .then(res => res.json())
      .then(body => { 
        
        res.json(body);
      });
    };

exports.productDeatils =  async (req, res) => {
  await fetch(`https://jombeli.ngrok.io/pi/mercari/product?uri=${req.query.uri}`)
      .then(res => res.json())
      .then(body => {
        body.product.price =  body.product.price.toFixed(2).toString()
        res.json(body);
      });
    };

    

