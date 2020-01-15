
const { errorHandler } = require("../helpers/dbErrorHandler");
const fetch = require('node-fetch');
let price = 0.04

exports.listSearch =  async (req, res) => {
  const item = [];
  await getPrice();
  
  
  fetch(`https://rakuten_webservice-rakuten-marketplace-item-search-v1.p.rapidapi.com/IchibaItem/Search/20170706?keyword=${req.query.search}&field=0&sort=standard&page=${req.query.page || 1}&minPrice=${(Math.floor(req.query.minPrice/price))||''}&maxPrice=${(Math.floor(req.query.maxPrice/price)) || ''}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "rakuten_webservice-rakuten-marketplace-item-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "43054b433amsh968b5b7eefe8149p160699jsn0e21e14e7ec2"
    }
  })
  .then(res => res.json())
  .then(body => {
    
     
    // console.log(body.Items);
    body.Items.forEach(element => {
      let markup = 400;
      // console.log(element.Item.mediumImageUrls.length || '');
      if (element.Item.itemPrice < 10000) {
        markup = 250;
      } 
      const rakuten_item = {
        name: element.Item.itemName,
        price: (element.Item.itemPrice * parseFloat(price)) + (markup* parseFloat(price)),
        link: element.Item.itemUrl,
        image1: element.Item.mediumImageUrls[0].imageUrl.slice(0,-12),
        image: element.Item.mediumImageUrls || [],
        source:'rakuten',
        description: element.Item.itemCaption
      }
      rakuten_item.price = (Math.round(rakuten_item.price * 100) / 100).toFixed(2);

      item.push(rakuten_item);
    });
    
    console.log(price);
    
    res.json(item);
  })
  .catch(err => {
    return res.status(400).json(
      [] //send an empty instead of the err msg
    );
  });

};




getPrice =  async () => {
   await fetch(`https://jombeli.ngrok.io`)
      .then(res => res.json())
      .then(body => {
        price = body;
      });
    };



