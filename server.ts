import * as express from "express";
import * as socketio from "socket.io";
import { IoConnection } from "./server/ioConnection";

var app = express();
app.set("port", process.env.PORT || 31111);

// Routing
app.use("/", express.static(__dirname + "/public"));
app.get("/", function(req,res) {
  res.sendfile("public/index.html");
});

var server = app.listen(app.get("port"), () =>{
  console.log("Server listening at port %d", app.get("port"));
});

var io = socketio(server);
// add socket io logic
var ioConnection = new IoConnection(io);

module.exports = app;



