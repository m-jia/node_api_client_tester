const cryptoJS = require("crypto-js");
const axios = require("axios");

var apiKey = "API_KEY";
var apiSecret = "API_SECRET";

var timestamp = Date.now();
var payload = {market: "CAD-ADA", order: {price: "0.05", side: "buy", size: "60"}};
var json = JSON.stringify(payload);

var contentHash = cryptoJS.SHA512(json).toString(cryptoJS.enc.Hex);

console.log(`payload: ${payload}`);
console.log(`json: ${json}`);
console.log(`contentHash: ${contentHash}`);

var parts = [
    timestamp,
    "POST",
    "localhost:4000/api/v1/orders",
    contentHash
];

const signature = cryptoJS.HmacSHA512(parts.join(""), apiSecret).toString(cryptoJS.enc.Hex);

var headers = {
    'cx-api-key': apiKey,
    'cx-content-hash': contentHash,
    'cx-timestamp': timestamp,
    'cx-signature': signature
};

axios.post('http://localhost:4000/api/v1/orders', payload, {headers: headers})
    .then((res) => { console.log("RESPONSE: ", res); })
    .catch((err) => { console.log("ERROR: ", err); })
