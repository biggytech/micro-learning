const requestLogger = () => {
  return (req, res, next) => {
    console.log(
      `${req.method} ${req.originalUrl} ${
        req.method === "POST" ? JSON.stringify(req.body) : ""
      }`
    );
    next();
  };
};

module.exports = requestLogger;
