module.exports = {
  apps: [
    {
      name: "sprint-panda-market",
      script: "./src/server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--experimental-specifier-resolution=node",
      },
    },
  ],

  deploy: {
    production: {
      user: "ec2-user",
      host: "",
      ref: "origin/main",
      repo: "git@github.com:rklpoi5678/9-sprint-mission-be.git",
      path: "/home/ec2-user/9-sprint-mission-be",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
    },
  },
};
