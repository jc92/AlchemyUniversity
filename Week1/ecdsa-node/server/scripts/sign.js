// Pass private key to get signature
const secp = require("ethereum-cryptography/secp256k1");
const {
    toHex,
    hexToBytes,
    utf8ToBytes,
} = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

async function getSignature(privateKey) {
    const signature = await secp.sign(
        keccak256(utf8ToBytes("Hello World")), // password
        hexToBytes(privateKey),
        { recovered: true, extraEntropy: true }
    );
    return signature;
}

if (process.argv.length === 5 && process.argv[2].match(/^[0-9A-F]{64}$/i)) {
    getSignature(process.argv[2]).then((signature) => {
        console.log("Signature: ", toHex(signature[0]) + signature[1].toString(16));
    });
} else {
    console.log(`Usage:
  $ node scripts/sign.js [PRIVATE KEY]`);
}