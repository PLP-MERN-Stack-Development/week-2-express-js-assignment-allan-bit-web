const auth = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey !== '123456') return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  next();
};
module.exports = auth;
