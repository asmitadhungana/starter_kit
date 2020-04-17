pragma solidity ^0.5.0;

import "./PolarToken.sol";


contract EtherSwap {
    string public name = "Ether Exchanger";
    PolarToken public token;
    uint256 public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokensSold(
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

        //EtherSwap must have enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public {
        //User cannot sell more tokens than s/he has
        require(token.balanceOf(msg.sender) >= _amount);

        //Calculate the amount of Ether to redeem
        uint256 etherAmount = _amount / rate;

        //Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        //Now, perform sale!
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        //Emit event
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}
