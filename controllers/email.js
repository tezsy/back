const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.confirmPurchaseEmail =  (name, email, order) => {
    
    const p = order.products[0];
    

    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `We Have Receive Your Order`,
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Order Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
        .center{
            width:49%;
            display: inline-block;
            margin-left: auto;
            margin-right: auto;
        }
        </style>
        </head>
        <body style="margin: 0; padding: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">	
                <tr>
                    <td style="padding: 10px 0 30px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                            <tr>
                                <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                                    <img src="https://res.cloudinary.com/drzyjnnsq/image/upload/v1578741282/web/logo_xde_back_fsuei0.png" alt="jombeli.org" width="300" height="100" style="display: block;" />
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                                <b>Hey ${name}, Thank you for your purchase.</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 20px;">
                                                <p>we have verify your payment and handling your shipping right now</p>
                                                <p>your order summary</p>
                                                <br>
                                                <table border="1" cellpadding="10" cellspacing="3" width="100%">
                                                  
                                                    <tr>
                                                        
                                                        <td style="color: #153643; font-family: Arial, sans-serif; font-size: 14px;">
                                                            <b>name: </b>${p.name}<br><br>
                                                     
                                                            <b>price: </b>RM ${p.price.toFixed(2)}<br><br>
                                                            <b>images</b><br>
                                                            <table border="0" cellpadding="1" cellspacing="3" >
                                                                <tr>
                                                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 14px;">
                                                                        <img class="center"  src=${p.image1} alt="">
                                                                        <img class="center"  src=${p.image2} alt="">
                                                                        <img class="center"  src=${p.image3} alt="">
                                                                        <img class="center"  src=${p.image4} alt="">
                                                                        <img class="center"  src=${p.image5} alt="">
                                                                        <img class="center"  src=${p.image6} alt="">
                                                                        <img class="center"  src=${p.image7} alt="">
                                                                        <img class="center"  src=${p.image8} alt="">
                                                                        <img class="center"  src=${p.image9} alt="">
                                                                        <img class="center"  src=${p.image10} alt="">
                                                                      
                                                                    </td>
                                                                </tr>
                                                        
                                                             
                                                               
                                                            </table>
                                                        </td>
                                                    </tr>
                                            
                                                 
                                                   
                                                </table>
                                            </td>
                                        </tr>
                                     
                                       
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                                <a href="#" style="color: #ffffff;"><font color="#ffffff">contact us</font></a><br/><br/>
                                                &reg; Jombeli.org
                                            </td> 
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
            
        `
    };

    sgMail.send(emailData)

   
 };


 exports.emailTracking = (req, res,next) => {

    const p = req.body.order.products[0];

    const emailData = {
        from: process.env.EMAIL_FROM,
        to: req.body.email,
        subject: `Tracking number details`,
        html: `
            
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Order Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
        .center{
            width:49%;
            display: inline-block;
            margin-left: auto;
            margin-right: auto;
        }
        </style>
        </head>
        <body style="margin: 0; padding: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">	
                <tr>
                    <td style="padding: 10px 0 30px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                            <tr>
                                <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                                    <img src="https://res.cloudinary.com/drzyjnnsq/image/upload/v1578741282/web/logo_xde_back_fsuei0.png" alt="jombeli.org" width="300" height="100" style="display: block;" />
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                                <b>Hey ${req.body.name}, we have shipped your item.</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 20px;">
                                                <p>we have verify your payment and shipped your item</p>
                                                <p>your order summary</p>
                                                <br>
                                                <table border="1" cellpadding="10" cellspacing="3" width="100%">
                                                    <tr>
                                                        <td style="color: #153643; font-family: Arial, sans-serif; font-size: 14px;">
                                                            <b>tracking number: </b>${req.body.tracking} <br><br>
                                                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        
                                                        <td style="color: #153643; font-family: Arial, sans-serif; font-size: 14px;">
                                                            <b>name: </b>${p.name}<br><br>
                                                     
                                                            <b>price: </b>RM ${p.price.toFixed(2)}<br><br>
                                                            <b>images</b><br>
                                                            <table border="0" cellpadding="1" cellspacing="3" >
                                                                <tr>
                                                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 14px;">
                                                                        <img class="center"  src=${p.image1} alt="">
                                                                        <img class="center"  src=${p.image2} alt="">
                                                                        <img class="center"  src=${p.image3} alt="">
                                                                        <img class="center"  src=${p.image4} alt="">
                                                                        <img class="center"  src=${p.image5} alt="">
                                                                        <img class="center"  src=${p.image6} alt="">
                                                                        <img class="center"  src=${p.image7} alt="">
                                                                        <img class="center"  src=${p.image8} alt="">
                                                                        <img class="center"  src=${p.image9} alt="">
                                                                        <img class="center"  src=${p.image10} alt="">
                                                                      
                                                                    </td>
                                                                </tr>
                                                        
                                                             
                                                               
                                                            </table>
                                                        </td>
                                                    </tr>
                                            
                                                 
                                                   
                                                </table>
                                            </td>
                                        </tr>
                                     
                                       
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#70bbd9" style="padding: 30px 30px 30px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                                <a href="#" style="color: #ffffff;"><font color="#ffffff">contact us</font></a><br/><br/>
                                                &reg; Jombeli.org
                                            </td> 
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
            
        `
    };

    sgMail.send(emailData);
    next();
};