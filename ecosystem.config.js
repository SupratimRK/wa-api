module.exports = {
  apps: [
    {
      name: 'wa-api',
      script: './src/index.js',
      instances: 1,                 // Scale instances as needed (e.g., 'max' for cluster mode)
      autorestart: true,            // Auto-restart if the app crashes
      watch: false,                 // Disable watch in production
      max_memory_restart: '1G',     // Higher memory limit for production, due to headless browser usage
      
      // Default Environment (Development)
      // Run with: pm2 start ecosystem.config.js
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
