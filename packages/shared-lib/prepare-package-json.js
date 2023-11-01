/**
 * @file This script creates a package.json file with the type: module property.
 */
const fs = require('fs');
const path = require('path');

const buildDir = './build';

/**
 * Creates a package.json file with the type: module property.
 */
const createEsmModulePackageJson = () => {
  fs.readdir(buildDir, (err, dirs) => {
    if (err) {
      throw err;
    }
    dirs.forEach((dir) => {
      if (dir === 'esm') {
        const packageJsonFile = path.join(buildDir, dir, '/package.json');
        if (!fs.existsSync(packageJsonFile)) {
          fs.writeFile(packageJsonFile,
            new Uint8Array(Buffer.from('{"type": "module"}')),
            (err) => {
              if (err) {
                throw err;
              }
            });
        }
      }
    });
  });
};

createEsmModulePackageJson();