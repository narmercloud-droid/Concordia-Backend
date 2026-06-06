module.exports = {
  apps: [
    {
      name: "concordia-backend",
      script: "dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      out_file: "logs/out.log",
      error_file: "logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      max_size: "10M",
      retain: 5
    }
  ]
};
