//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
interface IWinner {
    function attempt() external;
}
contract Contract {
    function run_winner() public {
        IWinner(0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502).attempt();
    }
}