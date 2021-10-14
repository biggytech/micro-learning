const express = require("express");
const path = require("path");
require("./db");

const scheduler = require("./scheduler");
const settings = require("./repository/settings");
const keys = require("./repository/keys");
const { keepDynoAwake } = require("./services");
const {
  SCHEDULER_INTERVAL_IN_MIN,
  PUSH_LIFETIME_IN_SECONDS,
  DEFAULT_APP_PORT,
} = require("./constants");

const PORT = process.env.PORT || DEFAULT_APP_PORT;

startTheApp();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!");
  console.log(err);
  console.log(err.stack);
});

async function startTheApp() {
  if (!+process.env.IS_DEV) {
    keepDynoAwake();
  }

  const vapidKeys = await getVAPIDKeys();
  scheduler.scheduleSendingNotifications(vapidKeys, {
    intervalInMin: SCHEDULER_INTERVAL_IN_MIN,
    pushLifetimeInSec: PUSH_LIFETIME_IN_SECONDS,
  });

  const app = express();

  app.use(express.static(path.resolve(__dirname, "../client/dist")));
  app.use(express.json());
  app.use((err, req, res, next) => {
    console.log(err);
    console.log(err.stack);
    res.status(500).send({
      error: err.message,
    });
  });

  app.get("/api/keys", (req, res) => {
    console.log("GET /api/keys");
    res.send({
      publicKey: vapidKeys.publicKey,
    });
  });

  app.post("/api/settings/delete", async (req, res) => {
    const clientId = req.body.clientId;
    console.log(`POST /api/settings/delete ${clientId}`);

    if (!clientId) {
      return res.status(400).send({
        error: "Provide clientId",
      });
    }

    try {
      await settings.delete(clientId);
      console.log(`Settings deleted ${clientId}`);
      res.end();
    } catch (e) {
      console.log(e);
      res.status(500).send({
        error: "Something went wrong",
      });
    }
  });

  app.post("/api/settings", async (req, res) => {
    const body = req.body;
    console.log("POST /api/settings");
    console.log(JSON.stringify(body));

    if (!body.clientId) {
      return res.status(400).send({
        error: "Provide clientId",
      });
    }

    try {
      const doc = await settings.upsert(body.clientId, body);
      console.log(`Settings saved ${body.clientId}`);
      res.send(doc);
    } catch (e) {
      console.log(e);
      res.status(500).send({
        error: "Something went wrong",
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
}

async function getVAPIDKeys() {
  const existingKeys = await keys.get();
  if (existingKeys) {
    return existingKeys;
  }
  return await keys.create();
}
