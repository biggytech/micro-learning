const getCurrentUTC = () => {
  const currentServerTime = new Date(),
    hour = currentServerTime.getUTCHours(),
    minute = currentServerTime.getUTCMinutes();

  return { hour, minute };
};

module.exports = getCurrentUTC;
