const { URL } = require('url');

module.exports = ({ env }) => {
  const assetUrl = env('STORAGE_ASSET_URL');
  let baseUrl;
  let rootPath;

  if (assetUrl) {
    const u = new URL(assetUrl);
    baseUrl = `${u.protocol}//${u.host}`;
    rootPath = u.pathname.replace(/^\/|\/$/g, '') || undefined;
  }

  return {
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          baseUrl,
          rootPath,
          s3Options: {
            endpoint: `https://${env('STORAGE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
              accessKeyId: env('STORAGE_ACCESS_KEY'),
              secretAccessKey: env('STORAGE_SECRET_KEY'),
            },
            params: {
              Bucket: env('STORAGE_BUCKET_NAME'),
            },
            forcePathStyle: true,
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
};
