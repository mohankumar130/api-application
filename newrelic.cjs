// newrelic.cjs
'use strict';

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'My App'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || '',
  logging: {
    level: 'info',
  },
  allow_all_headers: true,
  attributes: {
    enabled: true,
  },
};
