import * as express from "express";
import * as socketio from "socket.io";
import { IoConnection } from "./server/ioConnection";

var app = express();
app.set("port", process.env.PORT || 3000);

// Routing
app.use("/", express.static(__dirname + "/public"));
app.use("/libs", express.static(__dirname + "/node_modules"));
app.get("/", function(req,res) {
  res.sendfile("public/index.html");
});

var server = app.listen(app.get("port"), () =>{
  console.log("Server listening at port %d", app.get("port"));
});

var io = socketio(server);
var ioConnection = new IoConnection(io);




