// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LoyaltyToken is ERC20 {
    address public owner;
    uint256 public nextProductId = 1;

    struct Transaction {
        uint256 timestamp;
        uint256 amount;
        uint256 productId;
        bool isRedeem;
    }

    struct Product {
        uint256 productId;
        string name;
        uint256 price;
        uint256 cashbackAmount;
        uint256 maxRedeemableTokens;
        string imageUrl; 
    }

    mapping(address => bool) public isSeller;
    mapping(uint256 => address) public productSellers;
    mapping(address => Transaction[]) public userTransactions;
    mapping(address => Transaction[]) public sellerTransactions;
    mapping(address => Product[]) public sellerProducts;
    Product[] public allProducts;

    constructor() ERC20("FlipCoin", "FC") {
        owner = msg.sender;
        _mint(owner, 100000 * 10 ** decimals()); // Mint initial tokens
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    modifier onlySeller() {
        require(isSeller[msg.sender], "Only registered sellers can call this function");
        _;
    }

    // Function for the owner to register sellers
    function registerSeller(address seller) public onlyOwner {
        isSeller[seller] = true;
    }

    // Function for sellers to add products
    function addProduct(string memory productName, uint256 price, uint256 cashbackAmount, uint256 maxRedeemableTokens, string memory imageUrl) public onlySeller {
        uint256 productId = nextProductId;
        productSellers[productId] = msg.sender;
        sellerProducts[msg.sender].push(Product(productId, productName, price, cashbackAmount, maxRedeemableTokens, imageUrl)); // Add imageUrl
        allProducts.push(Product(productId, productName, price, cashbackAmount, maxRedeemableTokens, imageUrl)); // Add imageUrl
        nextProductId++;
    }

    // Function for sellers to retrieve their product details
    function getSellerProduct(address seller, uint256 productId) public view returns (uint256, string memory, uint256, uint256, uint256, string memory) {
        Product storage product = sellerProducts[seller][productId];
        return (product.productId, product.name, product.price, product.cashbackAmount, product.maxRedeemableTokens, product.imageUrl);
    }

    // Function for users to redeem tokens for a specific product
    function redeem(uint256 amount, uint256 productId) public returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(productId > 0 && productId < nextProductId, "Invalid product ID");
        Product storage product = sellerProducts[productSellers[productId]][productId];
        require(product.price > 0, "Product does not exist");
        require(product.cashbackAmount > 0 && amount <= product.maxRedeemableTokens, "Invalid redemption");

        address seller = productSellers[productId];
        require(seller != address(0), "Product does not have a seller");
        require(balanceOf(msg.sender) >= amount, "Insufficient token balance");
        
        _transfer(msg.sender, seller, amount);
        emit TokensRedeemed(msg.sender, amount, productId);
        userTransactions[msg.sender].push(Transaction(block.timestamp, amount, productId, true));
        sellerTransactions[seller].push(Transaction(block.timestamp, amount, productId, true));
        return true;
    }

    // Function for sellers to give cashbacks to users
    function giveCashback(address user, uint256 amount, uint256 productId) public {
        address seller = productSellers[productId];
        // require(seller != address(0), "Product does not have a seller");
        require(balanceOf(seller) >= amount, "Insufficient seller token balance");

        _transfer(msg.sender, user, amount);
        emit CashbackGiven(msg.sender, user, amount);

        sellerTransactions[msg.sender].push(Transaction(block.timestamp, amount, productId, false)); // Add cashback transaction
    }

    // Function to retrieve the consolidated transaction history of a seller
    function getSellerTransactions() public view returns (Transaction[] memory) {
        return sellerTransactions[msg.sender];
    }

    // Function to get the token balance of a user or seller
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
    
    // Function to retrieve all product details
    function getAllProducts() public view returns (Product[] memory) {
        return allProducts;
    }

    // Function to retrieve all products added by a specific seller
    function getSellerProducts(address seller) public view returns (Product[] memory) {
        return sellerProducts[seller];
    }

    function buyTokens(uint256 amount) public onlySeller {
        require(amount > 0, "Amount must be greater than 0");
        _transfer(owner, msg.sender, amount);
        emit TokensPurchased(msg.sender, amount);
    }

    function getTransactionsByAddress(address user) public view returns (Transaction[] memory) {
        if (isSeller[user]) {
            return sellerTransactions[user];
        } else {
            return userTransactions[user];
        }
    }

    function isUserSeller(address user) public view returns (bool) {
        return isSeller[user];
    }

    // Event emitted when tokens are redeemed by a user
    event TokensRedeemed(address indexed user, uint256 amount, uint256 productId);

    // Event emitted when cashback is given to a user
    event CashbackGiven(address indexed seller, address indexed user, uint256 amount);

    // Event emitted when tokens are purchased by a seller
    event TokensPurchased(address indexed seller, uint256 amount);
}
