
const cheerio = require('cheerio');
const fetch = require('node-fetch');
var request = require("request");

exports.listSearch =  async (req, res) => {
  await fetch(`https://jombeli.ngrok.io/pi/mercari/search?page=${req.query.page||1}&search=${req.query.search}&price_min=${req.query.min_price || ""}&price_max=${req.query.max_price || ""}`)
  
      .then(res => res.json())
      .then(body => {
        res.json(body);
      });
    };


async function getvals(){
  await fetch('https://api.exchangeratesapi.io/latest?base=JPY',
  {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((responseData) => {
    const result = responseData.rates.MYR;
    return result;
  })
  .catch(error => console.warn(error));
}



