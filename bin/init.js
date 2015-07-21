#!/usr/bin/env node

/**
 * for init command:
 * nej-init
 * nej-init /path/to/dir/
 * nej-init ./relative/to/current/directory/
 */

var args = process.argv.slice(2);
require('../main.js').init(
    args[0]||'./'
);
