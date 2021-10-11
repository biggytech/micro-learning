const https = require("https");
const { DYNO_AWAKE_INTERVAL } = require("../constants");

const keepDynoAwake = () => {
  setInterval(function () {
    try {
      console.log("Calling dyno to awake");
      https.get(process.env.APP_URL);
    } catch (err) {
      console.log(err);
    }
  }, DYNO_AWAKE_INTERVAL);
};
module.exports = keepDynoAwake;
