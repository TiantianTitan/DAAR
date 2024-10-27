// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract Collection is ERC721URIStorage, Ownable {
    string public name1;
    uint256 public nextTokenId;
    uint256 public pricePerPack;
    address public boosterAddress;

    // 定义事件
    event CardPurchased(address indexed buyer, uint256 tokenId, string tokenURI);
    event CardMinted(address indexed to, uint256 tokenId, string tokenURI);

    constructor(string memory _name, uint256 _pricePerPack)
    ERC721(_name, "CCG")
    Ownable(msg.sender) // 向 Ownable 构造函数传递 msg.sender
    {
        name1 = _name;
        pricePerPack = _pricePerPack; // 设置每个卡包的价格
        nextTokenId = 1; // 初始化 Token ID
    }

    function buyCard(string memory tokenURI) public payable {
        require(msg.value >= pricePerPack, "Insufficient funds to buy card pack");
        _safeMint(msg.sender, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);

        // 发出购买事件
        emit CardPurchased(msg.sender, nextTokenId, tokenURI);

        nextTokenId++;
        (bool success, ) = payable(owner()).call{value: msg.value}("");
        require(success, "Transfer failed");

    }

    // 新增函数：为用户铸造 n 张随机卡牌
    function mintRandomCards(address to, uint256 n) external returns (uint256[] memory) {
        console.log("Caller (msg.sender) in mintRandomCards:", msg.sender);
        console.log("Contract owner (owner()):", owner());
        console.log("Booster contract address (boosterAddress):", boosterAddress);

        require( msg.sender == boosterAddress, "Not authorized to mint cards");

        uint256[] memory cardIds = new uint256[](n);

        for (uint256 i = 0; i < n; i++) {
            uint256 tokenId = nextTokenId;
            _safeMint(to, tokenId);

            // 设置随机的 tokenURI，这里为了简单，使用固定的图片 URL，实际应用中应随机选取
            string memory tokenURI = getRandomTokenURI();
            _setTokenURI(tokenId, tokenURI);

            cardIds[i] = tokenId;
            console.log("TokenId : ",tokenId);
            emit CardMinted(to, tokenId, tokenURI);

            nextTokenId++;
        }
        console.log("maybe success ? ");
        return cardIds;
    }

    // 模拟随机获取 tokenURI 的函数
    function getRandomTokenURI() internal view returns (string memory) {
        // 在实际应用中，这里应返回随机的 tokenURI
        return "https://images.pokemontcg.io/pop9/2.png";
    }

    function setPrice(uint256 newPrice) public {
        require(msg.sender == owner(), "Only owner can set price");
        pricePerPack = newPrice;
    }

    // 新增函数：设置 Booster 合约地址
    function setBoosterAddress(address _boosterAddress) public {
        require(msg.sender == owner(), "Only owner can set booster address");
        boosterAddress = _boosterAddress;
    }
}
