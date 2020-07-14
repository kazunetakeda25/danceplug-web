module.exports = {
  apps: [
    {
      name: 'dp20web',
      exec_mode: 'cluster',
      instances: 'max',
      cwd: '/home/danceplug/web/current',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
    },
  ],
};
