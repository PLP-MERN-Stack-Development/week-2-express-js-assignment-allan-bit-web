const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const productRoutes = require('./routes/products');
const { NotFoundError, ValidationError } = require('./error');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(logger);
app.use(auth);

app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Use product routes
app.use('/api/products', productRoutes);

// Simulate route to show ValidationError usage
app.get('/validate-demo', (req, res, next) => {
  const invalid = true;
  if (invalid) return next(new ValidationError("Demo validation failed"));
  res.send("Should not reach here");
});

// ✅ Handle unknown/unmatched routes using NotFoundError
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});


// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
