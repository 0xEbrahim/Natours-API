import APIError from '../utils/APIError.js';

const handleUnhandledRoutes = (req, res, next) => {
  next(new APIError(`Page ${req.originalUrl} can't be reached`, 404));
};

export { handleUnhandledRoutes };
