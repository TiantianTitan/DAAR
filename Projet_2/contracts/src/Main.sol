// Main.sol
//import "./Deed.sol"; 

// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";

contract Main {
  int private count;
  mapping(int => Collection) private collections;

  constructor() {
    count = 0;
  }

  /*function createCollection(string calldata name, int cardCount) external {
    collections[count++] = new Collection(name, cardCount);
  }*/

  /*function mintInCollection(int collectionId, address to, string calldata tokenURI) external {
    Collection collection = collections[collectionId];
    collection.mintCard(to, tokenURI);
  }*/
}