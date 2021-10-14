const webpush = require("web-push");

const Keys = require("../models/Keys");

const KEYS_ID = 1;

const keys = {
  get: () => Keys.findOne({ _id: KEYS_ID }),
  create: async () => {
    const newKeys = new Keys({
      _id: KEYS_ID,
      ...webpush.generateVAPIDKeys(),
    });
    await newKeys.save();
    return newKeys.toObject({
      versionKey: false,
    });
  },
  getOrCreate: async () => {
    const existingKeys = await keys.get();
    if (existingKeys) {
      return existingKeys;
    }
    return await keys.create();
  },
};

module.exports = keys;
