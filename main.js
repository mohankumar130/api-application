// Load New Relic agent before anything else
require('./newrelic');

// Then load the ESM-based app
import('./server.js');
