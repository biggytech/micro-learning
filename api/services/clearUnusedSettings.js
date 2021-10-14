const settingsRepo = require("./repository/settings");

const clearUnusedSettings = async () => {
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
};

module.exports = clearUnusedSettings;
