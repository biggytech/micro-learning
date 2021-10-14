const Settings = require("../models/Settings");

const settings = {
  delete: (clientId) => Settings.findOneAndDelete({ clientId }),
  upsert: async (clientId, data) => {
    const doc = await Settings.findOneAndUpdate({ clientId }, data, {
      upsert: true,
      new: true,
    });
    // eslint-disable-next-line no-unused-vars
    const { _id, ...docObject } = doc.toObject({
      versionKey: false,
    });

    return docObject;
  },
  find: (...args) => Settings.find(...args),
};

module.exports = settings;
