// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"; // 修改导入
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Collection.sol"; // 导入 Collection.sol
import "hardhat/console.sol";

contract Booster is ERC721Enumerable, Ownable { // 修改继承
    uint256 public nextBoosterId;
    uint256 public boosterPrice;
    address public collectionAddress;

    event BoosterPurchased(address indexed buyer, uint256 boosterId);
    event BoosterOpened(address indexed owner, uint256 boosterId, uint256[] cardIds);

    constructor(uint256 _boosterPrice, address _collectionAddress)
    ERC721("Booster", "BOOST")
    Ownable(msg.sender) // 向 Ownable 构造函数传递 msg.sender
    {
        boosterPrice = _boosterPrice;
        collectionAddress = _collectionAddress;
        nextBoosterId = 1;
    }

    function buyBooster() external payable {
        require(msg.value >= boosterPrice, "Insufficient payment");
        _safeMint(msg.sender, nextBoosterId);


        emit BoosterPurchased(msg.sender, nextBoosterId);
        nextBoosterId++;
        // 将资金转移给合约所有者
        (bool success, ) = payable(owner()).call{value: msg.value}("");
        require(success, "Transfer failed");

    }

    function openBooster(uint256 boosterId) external {

        console.log("Booster owner:", ownerOf(boosterId));
        console.log("Caller (msg.sender):", msg.sender);

        require(ownerOf(boosterId) == msg.sender, "Not the owner of the booster");
        _burn(boosterId);

        // 调用 Collection 合约的函数，为用户铸造 5 张随机卡牌
        Collection collection = Collection(collectionAddress);
        uint256[] memory cardIds = collection.mintRandomCards(msg.sender, 5);

        emit BoosterOpened(msg.sender, boosterId, cardIds);
        console.log("Open success ! ");
    }
}
