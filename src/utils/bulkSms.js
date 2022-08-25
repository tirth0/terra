const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const Users = require('../models/User');

const getBody = (user) => `
        Hello ${user.name},
        Your prediction for ${user.district} is hello.
    `;

const bulkSmsUsers = async (req, res) => {
  try {
    const users = await Users.find({}).select({
      name: 1, _id: 0, mobile: 1, district: 1, pin: 1
    });
    await Promise.all(
      users.map((elem) => twilio.messages.create({
        to: parseInt(`+91${elem.mobile}`, 10),
        from: process.env.TWILIO_MESSAGING_SERVICE_SID,
        body: getBody(elem)
      }))
    )
      .then(() => {
        console.log('Messages sent!');
      })
      .catch((err) => console.error(err));

    return res.status(200).send('successfully sent messages');
  } catch (err) {
    console.log(err);
    return res.status(500).send('error ');
  }
};

module.exports = bulkSmsUsers;
