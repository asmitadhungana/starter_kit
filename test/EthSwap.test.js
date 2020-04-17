const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("EthSwap", (accounts) => {
  let token;
  let ethSwap;

  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
  });

  describe("Token deployment", async () => {
    it("contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "Polar Token");
    });
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });

    it("contract has tokens", async () => {
      let token = await Token.new();
      let ethSwap = await EthSwap.new();

      //Transfer all tokens to EthSwap (1 million)
      await token.transfer(ethSwap.address, "1000000000000000000000000");
      let balance = await token.balanceOf(ethSwap.address);

      assert.equal(balance.toString(), "1000000000000000000000000");
    });
  });

  describe("buyTokens()", async () => {
    it("allows user to instantly purchase tokens from ethSwap for a fixed price", async () => {
      ethSwap.buyTokens({ from: accounts[1], value: "100000000000000000" });
    });
  });
});
