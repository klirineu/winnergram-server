const { app } = require("./app")

app.listen(process.env.HTTPSERVER_PORT || 3333, () => {
    console.info("wg:http ➜ listen on *" + process.env.HTTPSERVER_PORT || 3333);
});
