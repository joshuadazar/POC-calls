const express = require("express");
const twilio = require("twilio");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = process.env.ACCOUNT_ID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

client.calls.create(
  {
    url: "https://poc-calls.onrender.com", // URL to fetch TwiML instructions
    to: "+573245896504", // Replace with the agent's phone number
    from: "+14237994134", // Replace with your Twilio phone number
  },
  (err, call) => {
    if (err) {
      console.error(err);
    } else {
      console.log(call.sid);
    }
  }
);

// Endpoint Twilio will request when the agent answers
app.post("/agentAnswered", (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.dial("+573042919693"); // Connect to the second phone number custumers
  res.type("text/xml");
  res.send(twiml.toString());
});

// Optionally, include your outbound call logic here or in another part of your application

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
