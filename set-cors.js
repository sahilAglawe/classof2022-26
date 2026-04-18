const https = require('https');
const path = require('path');
const os = require('os');

async function findAndSetCors() {
  // Get refresh token
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  const config = require(configPath);
  const refreshToken = config.tokens?.refresh_token;

  if (!refreshToken) {
    console.log('No refresh token found. Run: firebase login');
    return;
  }

  // Get access token
  const tokenData = await httpPost('oauth2.googleapis.com', '/token',
    `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com&client_secret=j9iVZfS8kkCEFUPaAeJV0sAi`,
    { 'Content-Type': 'application/x-www-form-urlencoded' }
  );
  const token = JSON.parse(tokenData).access_token;
  console.log('✅ Got access token');

  // List all buckets in the project
  console.log('\n📦 Listing all buckets in project classof2022-26...');
  const bucketsData = await httpGet('storage.googleapis.com', '/storage/v1/b?project=classof2022-26', token);
  const buckets = JSON.parse(bucketsData);
  
  if (buckets.items && buckets.items.length > 0) {
    console.log('Found buckets:');
    buckets.items.forEach(b => console.log('  -', b.name));

    // Set CORS on each bucket
    const corsData = JSON.stringify({
      cors: [{
        origin: ['*'],
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
        maxAgeSeconds: 3600,
        responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'x-goog-resumable'],
      }]
    });

    for (const bucket of buckets.items) {
      console.log(`\nSetting CORS on ${bucket.name}...`);
      try {
        const result = await httpPatch('storage.googleapis.com', `/storage/v1/b/${bucket.name}?fields=cors`, corsData, token);
        console.log(`✅ CORS set on ${bucket.name}!`);
      } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
      }
    }
  } else {
    console.log('❌ No buckets found! Make sure Firebase Storage is enabled.');
    console.log('Go to: https://console.firebase.google.com/project/classof2022-26/storage');
    console.log('Click "Get Started" to create the default bucket.');
  }
}

function httpPost(host, path, body, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: host, path, method: 'POST', headers: { ...headers, 'Content-Length': Buffer.byteLength(body) } }, res => {
      let data = ''; res.on('data', c => data += c); res.on('end', () => resolve(data));
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

function httpGet(host, path, token) {
  return new Promise((resolve, reject) => {
    https.get({ hostname: host, path, headers: { 'Authorization': `Bearer ${token}` } }, res => {
      let data = ''; res.on('data', c => data += c); res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function httpPatch(host, path, body, token) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: host, path, method: 'PATCH', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, res => {
      let data = ''; res.on('data', c => data += c); res.on('end', () => { if (res.statusCode === 200) resolve(data); else reject(new Error(`HTTP ${res.statusCode}: ${data}`)); });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

findAndSetCors();
