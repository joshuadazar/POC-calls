const express = require("express");
const twilio = require("twilio");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json()); // para poder parsear JSON
app.use(
  cors({
    origin: "https://www.clinicanaturlich.com",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = process.env.ACCOUNT_ID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
let customer;

app.post("/callAgent", (req, res) => {
  console.log(req.body); // imprime lo que se envió en la petición
  customer = req.body;
  console.log(customer);

  client.calls.create(
    {
      url: "https://poc-calls.onrender.com/agentAnswered", // URL to fetch TwiML instructions
      to: `+57${customer.userPhone}`, // Replace with the agent's phone number
      from: "+14237994134", // Replace with your Twilio phone number
    },
    (err, call) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          message: "connection no complited to POC API",
          ok: true, // indica que la operación fue exitosa
          status: "failed",
          data: customer, // devolver el cuerpo de la petición como datos de la respuesta
          agent: "no assigned agent",
          message: "No se pudo conectar con agente",
        });
      } else {
        console.log(call.sid, "ID Call");

        res.status(200).json({
          message: "Message received from  POC API",
          ok: true, // indica que la operación fue exitosa
          status: "success",
          data: customer, // devolver el cuerpo de la petición como datos de la respuesta
          agent: "Agent assigned ",
          message: "Datos recibidos correctamente",
        });
      }
    }
  );
});

// Endpoint Twilio will request when the agent answers
app.post("/agentAnswered", (req, res) => {
  console.log("request after agent response");
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.dial("+573042919693"); // Connect to the second phone number custumers
  res.type("text/xml");
  res.send(twiml.toString());
});

// Optionally, include your outbound call logic here or in another part of your application

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
