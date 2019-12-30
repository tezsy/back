const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.confirmPurchase =  (req, res) => {
    const {products,email} = req.body;
    console.log(email);
    console.log(products);

    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `We Have Receive Your Purchase(s)`,
        html: `
            <h1>item</h1>
            
            <hr />
            <p>${products[0].name}</p>
            
        `
    };

    sgMail.send(emailData)

   
 };


 exports.emailTracking = (req, res,next) => {

    
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: req.body.email,
        subject: `We Have Shipped Your Orders`,
        html: `
            <h1>item</h1>
            
            <hr />
            <p>${req.body.tracking}</p>
            <p>${req.body.name}</p>
            <p>${req.body.orderId}</p>
            
        `
    };

    sgMail.send(emailData);
    next();
};