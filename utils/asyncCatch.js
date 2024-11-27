const asyncCatch = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export { asyncCatch };
