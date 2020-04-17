pragma solidity ^0.5.0;

import "./Token.sol";


contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        //redemption rate = # of tokens they receive for 1 ether
        //calculate the no of tokens to buy
        // = amt of Ether * redemption rate
        uint256 tokenAmount = msg.value * rate;
        token.transfer(msg.sender, tokenAmount);
    }
}
