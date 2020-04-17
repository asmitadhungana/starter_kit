const PolarToken = artifacts.require("PolarToken");
const EtherSwap = artifacts.require("EtherSwap");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("EtherSwap", ([deployer, investor]) => {
  let token;
  let etherSwap;

  before(async () => {
    token = await PolarToken.new();
    etherSwap = await EtherSwap.new(token.address);

    //Transfer all tokens to EtherSwap (1 million)
    await token.transfer(etherSwap.address, tokens("1000000"));
  });

  describe("PolarToken deployment", async () => {
    it("contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "Polar Token");
    });
  });

  describe("EtherSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await etherSwap.name();
      assert.equal(name, "Ether Exchanger");
    });

    it("contract has tokens", async () => {
      let balance = await token.balanceOf(etherSwap.address);

      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("buyTokens()", async () => {
    let result;

    before(async () => {
      //Purchase tokens before each test
      result = await etherSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      });
    });

    it("Allows user to immediately purchase tokens from etherSwap for a fixed price", async () => {
      //Check if investor received tokens after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      //Check EtherSwap balance after purchase
      let etherSwapBalance;
      etherSwapBalance = await token.balanceOf(etherSwap, address);
      assert.equal(etherSwapBalance.toString(), tokens("999900"));
      etherSwapBalance = await web3.eth.getBalance(etherSwap.address);
      assert.equal(etherSwapBalance.toString(), web3.utils.toWei("1", "Ether"));

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });
});
