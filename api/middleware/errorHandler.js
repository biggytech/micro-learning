const errorHandler = () => {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    console.log(err);
    console.log(err.stack);
    res.status(500).send({
      error: err.message,
    });
  };
};

module.exports = errorHandler;
