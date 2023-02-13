pragma solidity ^0.8.0;
contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public counter_party;
    bool public isApproved;
    constructor(address _arbiter, address _counter_party) payable {
        arbiter = _arbiter;
        beneficiary = msg.sender;
        counter_party = _counter_party;
    }

    event Approved(uint);

    function achieved() public {
        require(msg.sender == arbiter);
        require(isApproved == false, "Already approved");
        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }
    function failed() public {
        require(msg.sender == arbiter);
        require(isApproved == false, "Already approved");
        uint balance = address(this).balance;
        (bool sent, ) = payable(counter_party).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }
}