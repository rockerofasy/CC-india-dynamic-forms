// server.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {
  decryptRequest,
  encryptResponse,
  FlowEndpointException,
} from "./encryption.js";
import { getNextScreen } from "./flow.js";
// import crypto from "crypto";
import sendFlowMessage from './sendFlow.js';
import fetchUserNs from "./fetchUserNs.js";

const app = express();

app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf?.toString(encoding || "utf8");
    },
  })
);

const { APP_SECRET, PRIVATE_KEY, PASSPHRASE = "", PORT = "3000" } = process.env;

app.post("/", async (req, res) => {
  if (!PRIVATE_KEY) {
    throw new Error(
      'Private key is empty. Please check your env variable "PRIVATE_KEY".'
    );
  }

  if (!isRequestSignatureValid(req)) {
    return res.status(432).send();
  }

  let decryptedRequest = null;
  try {
    decryptedRequest = decryptRequest(req.body, PRIVATE_KEY, PASSPHRASE);
  } catch (err) {
    console.error(err);
    if (err instanceof FlowEndpointException) {
      return res.status(err.statusCode).send();
    }
    return res.status(500).send();
  }

  const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;
  console.log("💬 Decrypted Request:", decryptedBody);

  const screenResponse = await getNextScreen(decryptedBody);
  console.log("👉 Response to Encrypt:", screenResponse);

  res.send(encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer));
});

app.post("/send-flow-message", async (req, res) => {
  const { flow_token, phone_number } = req.body;
  if (!flow_token || !phone_number) {
    return res.status(400).send({ error: "flow_token and phone_number are required" });
  }

  try {
    const userNs = await fetchUserNs(phone_number);
    console.log(userNs)
    const result = await sendFlowMessage(flow_token, phone_number);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

function isRequestSignatureValid(req) {
  return true;
}
