const express = require('express');
const client = require('prom-client');
const path = require('path');
const app = express();
const hostname = 'localhost'; // Your server IP address
const port = 5000;
const alertPort = 9093;

const version = '1.0.0';

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'Nodejs-Prometheus-Docker',
  version: version
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Custom counter metric
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestCounter);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'html')));

app.get('/', (req, res) => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status_code: res.statusCode });
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
    console.log(`[Version ${version}]: New request => http://${hostname}:${port}` + req.url);
});

// Health check
app.get('/health', (req, res) => {    
    res.sendStatus(200);
    httpRequestCounter.inc({ method: req.method, route: req.path, status_code: res.statusCode });
    console.log(`[Version ${version}]: New request => http://${hostname}:${port}` + req.url);
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
    console.log(`[Version ${version}]: Metrics endpoint accessed.`);
});

// Alert receiver endpoint
app.use(express.json()); // Middleware to parse JSON body

app.post('/alert', (req, res) => {
    console.log('Received alert:', req.body);
    res.sendStatus(200); // Respond with HTTP 200 to acknowledge receipt
});

// Start the main application
app.listen(port, () => {
    console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
});

// Start the alert receiver on a different port
app.listen(alertPort, () => {
    console.log(`Alert receiver listening at http://${hostname}:${alertPort}`);
});
