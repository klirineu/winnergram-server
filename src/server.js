const { app } = require("./app")

app.listen(process.env.HTTPSERVER_PORT || 5000, '0.0.0.0', () => {
    console.info("wg:http ➜ listen on *" + process.env.HTTPSERVER_PORT);
});
