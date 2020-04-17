pragma solidity ^0.5.0;

import "./PolarToken.sol";


contract EtherSwap {
    string public name = "Ether Exchanger";
    PolarToken public token;
    uint256 public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(PolarToken _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        //redemption rate = # of tokens they receive for 1 ether
        //calculate the no of tokens to buy
        // = amt of Ether * redemption rate
        uint256 tokenAmount = msg.value * rate;

        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }
}
