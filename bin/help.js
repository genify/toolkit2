#!/usr/bin/env node

var entry = process.argv[2];
switch(entry){
    case '-v':
    case '--version':
        console.log('nej toolkit version -> '+require('../package.json').version);
        console.log();
        process.exit();
    return;
    default:
        console.log('Usage:');
        console.log();
        console.log('  [command] [options]');
        console.log();
        console.log('Available Command:');
        console.log();
        console.log('  nej-init       Init deploy config file');
        console.log('                 nej-init [/path/to/config/dir/]');
        console.log();
        console.log('  nej-build      Deploy project using config file');
        console.log('                 nej-build [/path/to/release.conf]');
        console.log();
        console.log('  nej-demo       Create spa demo using nej modular system');
        console.log('                 nej-demo [/path/to/demo/dir/]');
        console.log();
        console.log('  nej-patch      Create widget platform patch files');
        console.log('                 nej-patch [patch_name] [/path/to/patch/dir/]');
        console.log();
        console.log('Available Options:');
        console.log();
        console.log('  -v, --version  Show toolkit version');
        console.log();
        process.exit();
    return;
}


