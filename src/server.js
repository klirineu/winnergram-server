const { app } = require("./app")

app.listen(process.env.HTTPSERVER_PORT, () => {
    console.info("wg:http ➜ listen on *" + process.env.HTTPSERVER_PORT);
});
