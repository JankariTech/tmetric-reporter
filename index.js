const search = require('./searches/reportDetailed');

const authentication = {
  type: 'custom',
  test: {
    url:
        'https://app.tmetric.com/api/version',
  },
  fields: [
    {
      key: 'api_token',
      type: 'string',
      required: true,
      helpText: 'Found on your profile page.',
    },
  ],
};

const addApiTokenToHeader = (request, z, bundle) => {
  request.headers.Authorization = `Bearer ${bundle.authData.api_token}`;
  return request;
};

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,
  beforeRequest: [addApiTokenToHeader],

  // If you want your trigger to show up, you better include it here!
  triggers: {},

  // If you want your searches to show up, you better include it here!
  searches: {
    [search.key]: search
  },

  // If you want your creates to show up, you better include it here!
  creates: {},

  resources: {},
};
