const handleUnhandledRoutes = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Page ${req.originalUrl} can't be reached`
  });
};

export { handleUnhandledRoutes };
