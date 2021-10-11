const schedule = require("node-schedule");
const webpush = require("web-push");

const settingsRepo = require("./repository/settings");

const scheduler = {
  scheduleSendingNotifications: (
    vapidKeys,
    { intervalInMin, pushLifetimeInSec }
  ) => {
    schedule.scheduleJob(`*/${intervalInMin} * * * *`, async () => {
      for await (const settings of settingsRepo.find()) {
        const currentServerTime = new Date(),
          currentHourUTC = currentServerTime.getUTCHours(),
          currentMinuteUTC = currentServerTime.getUTCMinutes();

        console.log(`Current UTC: ${currentHourUTC}:${currentMinuteUTC}`);
        console.log(
          `Preffered: ${settings.notificationsHourUTC}:${settings.notificationsMinuteUTC}`
        );

        if (
          settings.notificationsHourUTC === currentHourUTC &&
          settings.notificationsMinuteUTC === currentMinuteUTC
        ) {
          try {
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
    });
  },
};

module.exports = scheduler;
