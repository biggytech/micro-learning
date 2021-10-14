const schedule = require("node-schedule");
const express = require("express");
const path = require("path");
require("./db");

const settings = require("./repository/settings");
const keys = require("./repository/keys");
const {
  keepDynoAwake,
  handleGlobalError,
  sendNotifications,
  clearUnusedSettings,
} = require("./services");
const {
  SCHEDULER_INTERVAL_IN_MIN,
  PUSH_LIFETIME_IN_SECONDS,
  DEFAULT_APP_PORT,
  BASE_URL,
} = require("./constants");
const { errorHandler, requestLogger } = require("./middleware");

const PORT = process.env.PORT || DEFAULT_APP_PORT;

process.on("uncaughtException", handleGlobalError);
startTheApp();

async function startTheApp() {
  if (!+process.env.IS_DEV) {
    keepDynoAwake();
  }

  const vapidKeys = await keys.getOrCreate();
  schedule.scheduleJob(`*/${SCHEDULER_INTERVAL_IN_MIN} * * * *`, async () => {
    await sendNotifications(vapidKeys, {
      pushLifetimeInSec: PUSH_LIFETIME_IN_SECONDS,
    });
  });
  // every week
  schedule.scheduleJob("0 0 * * 0", async () => {
    await clearUnusedSettings();
  });

  const app = express();
  app.use(express.static(path.resolve(__dirname, "../client/dist")));
  app.use(express.json());
  app.use(requestLogger());
  app.use(errorHandler());

  app.get(`${BASE_URL}/keys`, (req, res) => {
    res.send({
      publicKey: vapidKeys.publicKey,
    });
  });

  app.post(`${BASE_URL}/settings/delete`, async (req, res) => {
    const clientId = req.body.clientId;

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

  app.post(`${BASE_URL}/settings`, async (req, res) => {
    const body = req.body;

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
