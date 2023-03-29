const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
const msg = {
    to: 'darwadedaya882@gmail.com',
    from:'byteciphergit@gmail.com', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
//ES6
sgMail
    .send(msg)
    .then(() => { }, error => {
        console.error("14",error);

        // if (error.response) {
        //     console.error(error.response.body)
        // }
    });
//ES8
(async () => {
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
})();