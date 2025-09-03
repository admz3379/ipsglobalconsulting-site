module.exports = {
  apps: [{
    name: 'ips-backend',
    script: 'python3',
    args: 'app.py',
    cwd: '/home/user/webapp',
    env: {
      FLASK_ENV: 'production',
      PYTHONPATH: '/home/user/webapp'
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    error_file: '/home/user/webapp/logs/backend-error.log',
    out_file: '/home/user/webapp/logs/backend-out.log',
    log_file: '/home/user/webapp/logs/backend-combined.log',
    time: true
  }]
};