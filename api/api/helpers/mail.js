// Wrapper to send mails

const sgMail = require('@sendgrid/mail');
console.log(`Sendgrid API KEY: ${process.env.SENDGRID_API_KEY}`)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.send = function (to, from, subject, text, html) {
  const msg = {
    to: to,
    from: from,
    subject: subject,
    text: text,
    html: html,
  };
  console.log(msg);
  if (process.env.DEVELOPMENT) {
    console.log('Simulate sending Mail');
  } else {
    console.log('Sending mail');
    if (to.endsWith("@xitroo.com")) {
      // Only send testmails to known domain
      // Prevents spam during testing
      sgMail.send(msg);
    }
  }
}