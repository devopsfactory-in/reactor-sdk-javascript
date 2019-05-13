/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/*
This script writes `./test/integration/globals-for-browser.js`, which is used by
the in-browser integration tests to get their local environment. That file must
be generated by this script before the `parcel build` of
`integration-tests.html`.

This script requires these variables in its own environment:
  $ACCESS_TOKEN
  $COMPANY_ID
If they are not set, the script aborts. In addition, if
  $REACTOR_URL
is set, the Launch service at that URL will be used for tests rather than the
default (which is `https://reactor.adobe.io`, the production service for Launch).
*/

const fs = require('fs');

var errors = 0;
if (!process.env.ACCESS_TOKEN) {
  errors++;
  console.error('$ACCESS_TOKEN must be defined');
  console.info(
    "  for example: export ACCESS_TOKEN='eyJiOi...(lots more here)....YiHkRLQ'"
  );
}
if (!process.env.COMPANY_ID) {
  errors++;
  console.error('$COMPANY_ID must be defined');
  console.info(
    '  for example: export COMPANY_ID=CO1234567890abcdef1234567890abcdef'
  );
}
if (errors > 0) process.exit(1);

// Like String.prototype.toISOString(), but shows local time rather than GMT.
function toLocalISOString(date) {
  function pad(num, width = 2) {
    var norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
  }
  var tzo = -date.getTimezoneOffset();
  var dif = tzo >= 0 ? '+' : '-';
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    '.' +
    (date.getMilliseconds() < 100 ? '0' : '') +
    pad(date.getMilliseconds()) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  );
}

const env = process.env;
const none = 'none';
const envJs = `/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/*
This file was auto-generated by write-reactor-environment.js
at ${toLocalISOString(new Date())}.

Tests intended to run in a browser need this file to be generated before
the 'parcel build' of 'integration-tests.html', because in-browser tests can't
get configuration information directly from environment variables.

This package exports nothing. However, loading it has the side effect of loading
environment variables into jasmine.getEnv().reactorIntegrationTestGlobals.
*/
jasmine.getEnv().reactorIntegrationTestGlobals = jasmine.getEnv()
  .reactorIntegrationTestGlobals || {
  /* eslint-disable */
  ACCESS_TOKEN: '${env.ACCESS_TOKEN}',
  /* eslint-enable */
  COMPANY_ID: '${env.COMPANY_ID}',
  REACTOR_URL: '${env.REACTOR_URL || 'https://reactor.adobe.io'}',
};
const globals = jasmine.getEnv().reactorIntegrationTestGlobals;
export { globals as default };
`;

async function writeFile(fileName, fileContent) {
  fs.writeFile(fileName, fileContent, function(err) {
    if (err) {
      console.error(`Error writing to ${fileName}:`, err);
      process.exit(1);
    }
    process.exit(0);
  });
}

writeFile('./test/integration/globals-for-browser.js', envJs);