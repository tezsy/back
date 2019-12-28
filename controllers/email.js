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

