module.exports = {
  apps: [
    {
      name: "concordia-backend",
      script: "src/index.ts",
      interpreter: "node",
      exec_mode: "cluster",
      instances: "max",
      cron_restart: "0 */6 * * *",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
module.exports = {
  apps: [
    {
      name: 'concordia-backend',
      script: './dist/index.js',
      instances: 'max',           // Use all available CPU cores
      exec_mode: 'cluster',        // Enable cluster mode
      cron_restart: '0 */6 * * *',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Memory and CPU optimization
      max_memory_restart: '2G',    // Restart if memory exceeds 2GB
      
      // Node.js optimization flags
      node_args: [
        '--max-old-space-size=2048',      // Increase heap size to 2GB
        '--optimize_for_size',             // Optimize for smaller memory usage
        '--max-http-header-size=16384',    // Increase max HTTP header size
        '--trace-warnings',                // Show warnings with stack traces
      ],

      // Graceful shutdown
      kill_timeout: 5000,          // 5 seconds to gracefully shutdown
      wait_ready: true,            // Wait for app to signal ready
      listen_timeout: 3000,        // 3 seconds to listen for port

      // Watch and restart on file changes (development only)
      watch: ['src'],
      ignore_watch: ['node_modules', 'dist', 'logs'],
      watch_delay: 1000,           // 1 second delay after file change

      // Logging
      output: './logs/out.log',
      error: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Clustering
      max_restarts: 10,            // Max restarts in 1 hour
      min_uptime: '10s',           // Min uptime before restart counts

      // Auto restart on uncaught exception
      autorestart: true,
      max_failures: 5,
      min_uptime: '1m',
    },
  ],

  // Monitoring
  monitor_interval: 5000,  // Monitor every 5 seconds

  // Kill timeout
  kill_timeout: 5000,
};
