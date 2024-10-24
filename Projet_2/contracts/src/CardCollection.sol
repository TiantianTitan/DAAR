// 文件名：CardCollection.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CardCollection {
    struct Card {
        uint256 tokenId;
        string uri;
        uint256 price;
        address owner;
        bool forSale;
    }

    mapping(uint256 => Card) public cards;
    uint256 public cardCount;

    constructor() {
        // 初始化卡片集合
    }

    // 设置一个卡片供出售
    function setCardForSale(uint256 _tokenId, string memory _uri, uint256 _price) public {
        cards[_tokenId] = Card({
            tokenId: _tokenId,
            uri: _uri,
            price: _price,
            owner: msg.sender,
            forSale: true
        });
        cardCount++;
    }

    // 获取在售卡片
    function getForSaleCards() public view returns (Card[] memory) {
        Card[] memory forSaleCards = new Card[](cardCount);
        uint256 count = 0;

        for (uint256 i = 0; i < cardCount; i++) {
            if (cards[i].forSale) {
                forSaleCards[count] = cards[i];
                count++;
            }
        }

        return forSaleCards;
    }

    // 购买卡片
    function buyCard(uint256 _tokenId) public payable {
        Card storage card = cards[_tokenId];
        require(card.forSale, "Card is not for sale");
        require(msg.value == card.price, "Incorrect price");

        card.owner = msg.sender;
        card.forSale = false;

        payable(card.owner).transfer(msg.value);
    }
}
