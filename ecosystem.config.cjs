module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js"
  }],
  env: {
        // Dibutuhkan untuk nodejs menganggap bahwa
        // kode berjalan pada production
        NODE_ENV: "production",
	JWT_PASSWORD: "Darkkamban12"
        // Dibutuhkan pada aplikasi app.js untuk
        // set port aplikasi
        PORT: 80,
      },
}
