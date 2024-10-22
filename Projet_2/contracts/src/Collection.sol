// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Collection is ERC721URIStorage {
    string public name;
    uint256 public nextTokenId;
    address public owner;
    uint256 public pricePerPack;

    struct Card {
        uint256 tokenId;
        string uri;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => Card) public cards;

    constructor(string memory _name, uint256 _pricePerPack) ERC721(_name, "CCG") {
        name = _name;
        owner = msg.sender;
        pricePerPack = _pricePerPack; // 设置每个卡包的价格
    }

    function mintCard(address to, string memory tokenURI) public payable {
        require(msg.value >= pricePerPack, "Insufficient funds to buy card pack");
        _safeMint(to, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);

        cards[nextTokenId] = Card(nextTokenId, tokenURI, pricePerPack, true); // 记录卡牌信息
        nextTokenId++;
        
        // 把支付的资金转给合约所有者
        payable(owner).transfer(msg.value);
    }

    function setCardForSale(uint256 tokenId, uint256 price) public {
        require(msg.sender == ownerOf(tokenId), "You are not the owner of this card");
        cards[tokenId].isForSale = true;
        cards[tokenId].price = price;
    }



mapping(uint256 => Card) public cards;
uint256 public totalCards;

function getForSaleCards() public view returns (Card[] memory) {
    uint256 forSaleCount = 0;

    for (uint256 i = 0; i < totalCards; i++) {
        if (cards[i].isForSale) {
            forSaleCount++;
        }
    }

    Card[] memory forSaleCards = new Card[](forSaleCount);
    uint256 index = 0;

    for (uint256 i = 0; i < totalCards; i++) {
        if (cards[i].isForSale) {
            forSaleCards[index] = cards[i];
            index++;
        }
    }

    return forSaleCards;
}


    // 购买卡牌
    function buyCard(uint256 tokenId) public payable {
        require(cards[tokenId].isForSale, "This card is not for sale");
        require(msg.value >= cards[tokenId].price, "Not enough ETH to purchase");

        address cardOwner = ownerOf(tokenId);
        _transfer(cardOwner, msg.sender, tokenId);
        payable(cardOwner).transfer(msg.value);

        cards[tokenId].isForSale = false; // 从出售列表中移除
    }
}
