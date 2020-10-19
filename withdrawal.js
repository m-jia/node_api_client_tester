const cryptoJS = require("crypto-js");
const axios = require("axios");

var apiKey = "7a42ca4ad5794769b32e5d88bd49cc49";
var apiSecret = "685b0621aa784c4f89e83d781f530c71";

var timestamp = Date.now();
var payload = {address: "0x1234", amount: "60", currency: "ADA", payment_id: ""};
var json = JSON.stringify(payload);

var contentHash = cryptoJS.SHA512(json).toString(cryptoJS.enc.Hex);

console.log(`payload: ${payload}`);
console.log(`json: ${json}`);
console.log(`contentHash: ${contentHash}`);

var parts = [
    timestamp,
    "POST",
    "api.catalx.io/api/v1/withdrawals",
    contentHash
];

const signature = cryptoJS.HmacSHA512(parts.join(""), apiSecret).toString(cryptoJS.enc.Hex);

var headers = {
    'cx-api-key': apiKey,
    'cx-content-hash': contentHash,
    'cx-timestamp': timestamp,
    'cx-signature': signature
};

axios.post('https://api.catalx.io/api/v1/withdrawals', payload, {headers: headers})
    .then((res) => { console.log("RESPONSE: ", res); })
    .catch((err) => { console.log("ERROR: ", err); })
