#!/usr/bin/env bash

echo -e '#!/usr/bin/env node\n' "$(cat dist/index.js)" > dist/index.js
