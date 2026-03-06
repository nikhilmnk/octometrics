export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<svg><text>Internal Server Error</text></svg>');
};