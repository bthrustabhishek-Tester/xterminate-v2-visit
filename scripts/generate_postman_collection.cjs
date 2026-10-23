const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'data', 'api_endpoints_catalog.json');
const outputPath = path.join(__dirname, '..', 'data', 'xterminate_v2_postman_collection.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Group endpoints by category
const groups = {};
for (const item of catalog) {
  const cat = (item.category || 'General').replace(' v2 APIs', '').trim();
  if (!groups[cat]) groups[cat] = [];
  groups[cat].push(item);
}

const folders = [];

for (const [catName, items] of Object.entries(groups)) {
  const folder = {
    name: catName,
    item: []
  };

  for (const api of items) {
    const rawPath = api.endpoint.replace(/^\/api\/v2/, '');
    const pathParts = ['api', 'v2', ...rawPath.split('/').filter(Boolean)];
    const query = [];
    if (api.params) {
      for (const [k, v] of Object.entries(api.params)) {
        query.push({ key: k, value: String(v) });
      }
    }

    const reqItem = {
      name: `${api.method} ${api.endpoint}`,
      request: {
        method: api.method,
        header: [
          { key: 'Accept', value: 'application/json' },
          { key: 'Content-Type', value: 'application/json' }
        ],
        url: {
          raw: '{{baseUrl}}' + api.endpoint + (query.length ? '?' + query.map(q => q.key + '=' + encodeURIComponent(q.value)).join('&') : ''),
          host: ['{{baseUrl}}'],
          path: pathParts,
          query: query
        },
        description: api.description || ''
      }
    };

    if (api.endpoint !== '/api/v2/auth/login') {
      reqItem.request.auth = {
        type: 'bearer',
        bearer: [{ key: 'token', value: '{{bearerToken}}', type: 'string' }]
      };
    }

    if (api.body) {
      reqItem.request.body = {
        mode: 'raw',
        raw: JSON.stringify(api.body, null, 2),
        options: { raw: { language: 'json' } }
      };
    } else if (['POST', 'PUT', 'PATCH'].includes(api.method)) {
      reqItem.request.body = {
        mode: 'raw',
        raw: '{}',
        options: { raw: { language: 'json' } }
      };
    }

    // Auto-extract and save bearer token upon successful login in Postman
    if (api.endpoint === '/api/v2/auth/login') {
      reqItem.event = [
        {
          listen: 'test',
          script: {
            exec: [
              'if (pm.response.code === 200) {',
              '    var json = pm.response.json();',
              '    if (json && json.data && json.data.token) {',
              '        pm.collectionVariables.set("bearerToken", json.data.token);',
              '        console.log("Successfully stored bearerToken into collection variables.");',
              '    }',
              '}'
            ],
            type: 'text/javascript'
          }
        }
      ];
    }

    folder.item.push(reqItem);
  }

  folders.push(folder);
}

const postmanCollection = {
  info: {
    _postman_id: 'xterminate-v2-api-collection',
    name: 'Xterminate v2 API Collection',
    description: 'Comprehensive Postman API collection for Xterminate v2 platform (Dev/Staging/Production). Automatically stores JWT bearer tokens on login and passes them to all protected endpoints.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  variable: [
    {
      key: 'baseUrl',
      value: 'https://dev-xterminate-v2.businessthrust.com.sg',
      type: 'string'
    },
    {
      key: 'bearerToken',
      value: '',
      type: 'string'
    }
  ],
  item: folders
};

fs.writeFileSync(outputPath, JSON.stringify(postmanCollection, null, 2));
console.log(`Generated ${outputPath} with ${folders.length} folders and ${catalog.length} requests.`);
