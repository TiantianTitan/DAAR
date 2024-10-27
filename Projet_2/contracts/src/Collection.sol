//import "./Deed.sol"; 

// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Collection is ERC721URIStorage {
    string public name1;
    uint256 public nextTokenId;
    address public owner;
    uint256 public pricePerPack;

    constructor(string memory _name, uint256 _pricePerPack) ERC721(_name, "CCG") {
        name1 = _name;
        owner = msg.sender;
        pricePerPack = _pricePerPack; // 设置每个卡包的价格
    }

    function mintCard(address to, string memory tokenURI) public payable {
        require(msg.value >= pricePerPack, "Insufficient funds to buy card pack");
        _safeMint(to, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        nextTokenId++;
        // 把支付的资金转给合约所有者
        payable(owner).transfer(msg.value);
    }

    function setPrice(uint256 newPrice) public {
        require(msg.sender == owner, "Only owner can set price");
        pricePerPack = newPrice;
    }

    // 获取某个用户拥有的所有tokenURIs
    /*function getUserTokens(address user) public view returns (string[] memory) {
      uint256 balance = balanceOf(user);
      string[] memory tokenURIs = new string[](balance);
      
      for (uint256 i = 0; i < balance; i++) {
        uint256 tokenId = tokenOfOwnerByIndex(user, i);
        tokenURIs[i] = tokenURI(tokenId);
      }
      
      return tokenURIs;
    }*/

}




