const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  // Private key:  df8cb85e25227c239e3902f74f816c5f87c2c0dd8eebec48bd23139b8135667c
  // Public key:  0x4d3f37065ba315ea7850435a53acfed23e28646b
  "0x4d3f37065ba315ea7850435a53acfed23e28646b": 100, // 3045022100b06f591958401afeae385c15adfc504279f02a6c76de3c4c435e63099ba2d2b1022061c2e8b359c1bc257394be7325de48a1fd9888afe1183b14d1a99bd40a4a166f1
  // Private key:  17dc9e4feed8031a558f5c1c6c3b4b5f691bfdc4ba414008ed5201285ac04365
  // Public key:  0x52821bc42f066ef34613d5942f9025bf8de7981a
  "0x52821bc42f066ef34613d5942f9025bf8de7981a": 50,
  // Private key:  e54f23ca479a86ee4c173eacb8dc1aa864e20a974736be9641029109c21cb596
  // Public key:  0xbae9b59a8dcd5020347d2e012defcec1774380ad
  "0xbae9b59a8dcd5020347d2e012defcec1774380ad": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
