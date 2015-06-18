#!/usr/bin/env node

/**
 * for build command:
 * nej-build
 * nej-build /path/to/release.conf
 * nej-build ./relative/to/current/directory/release.conf
 */

var args = argc.parse(
    process.argv.slice(2)
);
require('../main.js').build(
    args[0]||'./release.conf'
);
