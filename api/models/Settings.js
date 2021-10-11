const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    clientId: String,
    subscription: String,
    notificationsHourUTC: Number,
    notificationsMinuteUTC: Number,
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("settings", settingsSchema);

module.exports = Settings;
