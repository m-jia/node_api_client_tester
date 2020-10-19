
var cryptoJS = require("crypto-js");
const { Socket } = require('phoenix-channels')

var timestamp = Date.now();
var apiKey = "API_KEY";
var apiSecret = "API_SECRET";
var parts = [
  timestamp,
  "AUTH",
  apiKey
];

const signature = cryptoJS.HmacSHA512(parts.join(""), apiSecret).toString(cryptoJS.enc.Hex);


let phoenixSocket = new Socket("ws://localhost:4000/socket", { params: { api_key: apiKey, timestamp: timestamp, signature: signature } });

phoenixSocket.onError(() => { console.log(`Connection lost at ${Date.now()}`); });
phoenixSocket.onClose(() => { console.log(`Connection closed by server at ${Date.now()}`); });


console.log(`Connecting to socket at: ${Date.now()}`);
phoenixSocket.connect();


let channel = phoenixSocket.channel(`users: ${signature}`, {});

channel.onError( () => console.log("there was an error!") )
channel.onClose( () => console.log("the channel has gone away gracefully") )

channel.join()
    .receive("ok", ({ messages }) => console.log(messages))
    .receive("error", ({ reason }) => console.error(reason))
    .receive("timeout", () => {
      let ts = Date.now();
      console.log(`Networking issue. ${ts}`);
    });


channel.on("orders:updated", (msg) => console.log(msg));
