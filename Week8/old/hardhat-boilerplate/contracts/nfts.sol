// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract PutYourETHWhereYourMouthIs is ERC721URIStorage  {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Escrow {
        address arbiter;
        address beneficiary;
        address counter_party;
        uint256 amount;
        bool isApproved;
    }

    mapping(uint256 => Escrow) public tokenIdToEscrows;

    constructor() ERC721 ("PutYourETHWhereYourMouthIs", "PYE"){

    }

    event Approved(uint);

    function generateNFT(uint256 tokenId,string memory goal) public returns(string memory){

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',goal,'</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">', "At stake: ",getStake(tokenId),'MATIC </text>',
            '</svg>'
        );
        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )    
        );
    }

    function getStake(uint256 tokenId) public view returns (string memory) {
        uint256 stakes = tokenIdToEscrows[tokenId].amount/1E18;
        return stakes.toString();
    }

    function getTokenURI(uint256 tokenId, string memory goal) public returns (string memory){
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Put your ETH where your mouth is #', tokenId.toString(), '",',
                '"description": "Do it or lose it",',
                '"image": "', generateNFT(tokenId,goal), '",',
                '"attributes": [',
                    '{',
                        '"trait_type": "Goal",',
                        '"value": "', goal, '"',
                    '},',
                    '{',
                        '"trait_type": "Active",',
                        '"value": "true"',
                    '}',
                ']',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }
    function mint(address arbiter, address _counter_party, string memory goal) payable public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        tokenIdToEscrows[newItemId] = Escrow(arbiter, msg.sender, _counter_party, msg.value, false);
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, getTokenURI(newItemId,goal));
    }

    function achieved(uint256 tokenId) public {
        require(_exists(tokenId), "Please use an existing token");
        Escrow memory escrow = tokenIdToEscrows[tokenId];
        require(msg.sender == escrow.arbiter,'only aribter can approve');
        require(escrow.isApproved == false, "Already approved");
        tokenIdToEscrows[tokenId].isApproved = true;
        uint balance = escrow.amount;
        (bool sent, ) = payable(escrow.beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        // abi.decode(tokenURI(tokenId));
    }
    function failed(uint256 tokenId) public {
        Escrow memory escrow = tokenIdToEscrows[tokenId];
        require(msg.sender == escrow.arbiter,'only aribter can approve');
        require(escrow.isApproved == false, "Already approved");
        tokenIdToEscrows[tokenId].isApproved = true;
        uint balance = escrow.amount;
        (bool sent, ) = payable(escrow.counter_party).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
    }

    // make soulbound
    function transferFrom(address from, address to, uint256 tokenId) override public {
        require(_exists(tokenId), "Please use an existing token");
        require(1==2, "This token is soulbound and cannot be transferred");
        require(ownerOf(tokenId) == from, "Please use an existing token");
        _transfer(from, to, tokenId);
}
}