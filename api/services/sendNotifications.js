const webpush = require("web-push");

const settingsRepo = require("../repository/settings");
const getCurrentUTC = require("./getCurrentUTC");

const sendNotifications = async (vapidKeys, { pushLifetimeInSec }) => {
  for await (const settings of settingsRepo.find()) {
    const { hour, minute } = getCurrentUTC();

    console.log("Run sending notifications");
    console.log(`Current UTC: ${hour}:${minute}`);
    console.log(
      `Preffered: ${settings.notificationsHourUTC}:${settings.notificationsMinuteUTC}`
    );

    if (
      !!+process.env.DISABLE_PUSH_TIME_RESTRICTIONS ||
      (settings.notificationsHourUTC === hour &&
        settings.notificationsMinuteUTC === minute)
    ) {
      try {
        console.log(JSON.stringify(settings));
        const result = await webpush.sendNotification(
          JSON.parse(settings.subscription),
          "",
          {
            vapidDetails: {
              subject: `mailto:${process.env.DEV_MAIL}`,
              publicKey: vapidKeys.publicKey,
              privateKey: vapidKeys.privateKey,
            },
            TTL: pushLifetimeInSec,
          }
        );
        console.log(result);
      } catch (e) {
        if (e.statusCode === 410) {
          await settingsRepo.delete(settings.clientId);
        } else {
          console.log(e);
        }
      }
    }
  }
};

module.exports = sendNotifications;
