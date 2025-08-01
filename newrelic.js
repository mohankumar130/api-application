'use strict';

exports.config = {
  app_name: ['Project3 API App'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  },
  distributed_tracing: {
    enabled: true
  }
};

