

const googleTranslate = require('google-translate')(process.env.GOOGLE_TRANSLATOR_KEY);

exports.translate =  async (req, res) => {

  
      googleTranslate.translate(req.body.context, 'en', function(err, translation) {
      res.json(translation.translatedText);
    });	
 };

