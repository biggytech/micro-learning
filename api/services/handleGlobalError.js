const handleGlobalError = (err) => {
  console.log("UNCAUGHT EXCEPTION!");
  console.log(err, err.stack);
};

module.exports = handleGlobalError;
