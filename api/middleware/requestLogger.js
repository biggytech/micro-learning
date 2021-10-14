const requestLogger = () => {
  return (req, res, next) => {
    console.log(
      `${req.method} ${req.originalUrl} ${
        req.method === "POST" ? req.body : ""
      }`
    );
    next();
  };
};

module.exports = requestLogger;
