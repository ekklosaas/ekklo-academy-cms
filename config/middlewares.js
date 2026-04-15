const { URL } = require('url');

module.exports = ({ env }) => {
  const assetUrl = env('STORAGE_ASSET_URL');
  const assetHost = assetUrl ? new URL(assetUrl).host : null;

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': ["'self'", 'data:', 'blob:', assetHost].filter(Boolean),
            'media-src': ["'self'", 'data:', 'blob:', assetHost].filter(Boolean),
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
