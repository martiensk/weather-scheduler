/**
 * @file Pm2 config file.
 */
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './apps/be/build/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'frontend',
      script: './apps/fe/.output/server/index.mjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};