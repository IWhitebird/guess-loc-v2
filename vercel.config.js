{
    "version": 2,
    "builds": [
      {
        "src": "vite.config.js",
        "use": "@vercel/node"
      },
      {
        "src": "public/**/*",
        "use": "@vercel/static"
      },
      {
        "src": "src/**/*",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "public/$1"
      }
    ]
  }
  