const schedule = require("node-schedule");
const webpush = require("web-push");

const settingsRepo = require("./repository/settings");
const { getCurrentUTC } = require("./services");

const scheduler = {
  scheduleSendingNotifications: (
    vapidKeys,
    { intervalInMin, pushLifetimeInSec }
  ) => {
    schedule.scheduleJob(`*/${intervalInMin} * * * *`, async () => {
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
  scheduleClearingUnusedSettings: () => {
    schedule.scheduleJob("0 0 * * 0", async () => {
      // every week
      console.log("Run clearing unused settings");
      const now = new Date();
      console.log(`Current time: ${now}`);
      const lastWeek = new Date(now.setDate(now.getDate() - 7));
      console.log(`Last week: ${lastWeek}`);
      for await (const settings of settingsRepo.find({
        updatedAt: { $lte: lastWeek },
      })) {
        console.log(`Settings last updated at: ${settings.updatedAt}`);
        console.log("Settings to delete:");
        console.log(settings);
        await settingsRepo.delete(settings.clientId);
      }
    });
  },
};

module.exports = scheduler;
