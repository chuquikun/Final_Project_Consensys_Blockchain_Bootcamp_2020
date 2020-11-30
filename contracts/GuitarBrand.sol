// SPDX-License-Identifier: FGG

pragma solidity ^0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


/**
 * @title GuitarBrand 
 * @dev Non-Fungible Token built on ERC721 standard, to create and transfer guitar ownership,
 * the contract represent the NFT for a guitar brand, 
 * defines who can create more guitars and set guitar dealers via role assignation.
 * It also works as registry of the guitars made by this brand.
 * @author Fernando Garduño Galaviz
 */

contract GuitarBrand is Ownable, AccessControl, ERC721, ReentrancyGuard{
    using SafeMath for uint256;
    
    address public brandOwner;
    // List of all the factories for this brand
    address[] public factories;
    // List of all the dealers of this guitar brand
    address[] public dealers;
    Guitar[] public guitars;

    
    /** 
    * @dev Roles' encoding
    * FACTORY is analog to a minter, they can make new guitars
    * Only dealers and factories can sell new guitars 
    * Regular owners of a guitar just can sell used guitars
    */
    bytes32 public constant FACTORY = keccak256("FACTORY");  
    bytes32 public constant DEALER = keccak256("DEALER"); 



    // Guitar Struct has all the attributes corresponding to token with Id `serial`
    struct Guitar {
        string model;
        uint price;
        uint serial;
        address factory;
        bool isNew;
        bool forSale;
    }

    /**
     * Events
     */
    event NewGuitarMinted(uint _serial);
    event ChangeGuitarOwnership(uint indexed _serial, address indexed previousOwner, address indexed newOwner, uint txTime);
    event ChangeGuitarPrice(uint indexed _serial, uint indexed _newPrice, uint _previousPrice);
    event SaleStatus(uint indexed _serial, address indexed Owner, bool _selling);
    event NewFactory(address indexed account);
    event ClosedFactory(address indexed account);
    event subDealear(address indexed account);
    event unsubDealer(address indexed account);

    /**
    * @dev The role FACTORY is the only one who can made guitars!!!!!!! (scream on guitars  with metal voice)
    */
    modifier onlyFactories() {
        // only a factory with must call this function
        require(hasRole(FACTORY, msg.sender), "Caller is not a manufacturer");
        _;
    }

    /**
    * @dev Modifier use to allow change price of an instrument and get it back to sale market
    */
    modifier onlyGuitarOwner(uint _serial) {
        // only a the owner f the instrument
        require(ownerOf(_serial) == msg.sender, "Caller does not own this guitar");
        _;
    }
    
    /**
    * @dev Just checks the existence of a guitar
    */

    modifier ifGuitarExists (uint _serial){
        require(_serial > 0 && _serial <= totalSupply(), "Guitar does not exist!");
        _;
    } 

        
    /**
    * @dev Just checks the existence of a guitar
    */

    modifier isForSale (uint _serial){
        require(_serial > 0 && _serial <= totalSupply(), "Guitar does not exist!");
        require(guitars[_serial-1].forSale, "Not for sale in this moment!");
        _;
    } 

  
    /**
     * @dev Initializes the contract by setting a `brandName` and a `brandSymbol` to the token collection.
     * Its set the 'brandOwner' to the owner contract which bay default it's  the one who instantiated it.
     * The hierachy in the company it's defined by the owner who can grant any role, the factories can
     * grant or revoke the dealer role using granRole/revokeRol functions from AccesControl
     */
    constructor(string memory brandName, string memory brandSymbol)
     ERC721(brandName, brandSymbol) public
      {
        brandOwner = owner(); 
        _setupRole(DEFAULT_ADMIN_ROLE, brandOwner);
        _setupRole(FACTORY, brandOwner);
        _setRoleAdmin(DEALER, FACTORY);  
    }

    /**
     * @dev It overrides AccesControl.sol's funtion to emit the proper event
     */
    function grantRole(bytes32 role, address account) public override{
        AccessControl.grantRole(role,account);
        if(FACTORY == role){emit NewFactory(account);}
        if(DEALER == role){emit subDealear(account);}
    }

        /**
     * @dev It overrides AccesControl.sol's funtion to emit the proper event
     */
    function revokeRole(bytes32 role, address account) public override{
        AccessControl.revokeRole(role,account);
        if(FACTORY == role){emit ClosedFactory(account);}
        if(DEALER == role){emit unsubDealer(account);}
    }

    /**
    * @dev Just for testing purposes
    * @return All the values of Guitar struct as a single string, separating the member of the strub by comma
    */
    function guitarData(uint _serial) public view ifGuitarExists(_serial) returns (string memory, uint, uint, address, bool, bool) {
        _serial = _serial-1; // the nth guitar is store in the index n-1 of guitars array
        return (guitars[_serial].model, guitars[_serial].price, guitars[_serial].serial, guitars[_serial].factory, guitars[_serial].isNew, guitars[_serial].forSale);
    }

    /**
     * @dev It creates a structure that accounts for a guitar construction
     * this structure it's related to the token set in the contructor function
     * @notice It is enforce to used double qupote to price input to avoid because javascript parses numbers up to 2^53-1
     */
    function mintGuitar(string memory _model, uint _price) public onlyFactories {
        // to prevent overflow and set a correct value for sale
        require( _price < _price+1 && _price > 0);
        // the guitar is mint and its info added to array of guitar created
        uint _serial = totalSupply().add(1);
        _safeMint(msg.sender, _serial);
        Guitar[] storage gtrs = guitars;
        gtrs.push(Guitar(_model, _price, _serial, msg.sender, true, true));
        emit NewGuitarMinted(_serial);
        // sets the ownership of the instrument to the factory
        emit ChangeGuitarOwnership(_serial, address(0x0), msg.sender, now);
    }

    /**
    * @dev The guitar owner can change the price of the instrument
    */

    function changePrice(uint _serial, uint _newPrice) public ifGuitarExists(_serial) onlyGuitarOwner(_serial){
        // to prevent overflow and set a correct value for sale
        require( _newPrice < _newPrice+1 && _newPrice > 0);
        require(guitars[_serial.sub(1)].price != _newPrice, "Price has not changed");
        uint _previousPrice =  guitars[_serial.sub(1)].price;
        guitars[_serial.sub(1)].price = _newPrice;
        emit ChangeGuitarPrice(_serial, _newPrice, _previousPrice);
    }

    /**
    * @dev The guitar owner can change the price of the instrument
    */

    function changeSaleStatus(uint _serial) public ifGuitarExists(_serial) onlyGuitarOwner(_serial){
        uint n =  _serial.sub(1);
        guitars[n].forSale = !(guitars[n].forSale);
        emit SaleStatus(_serial, msg.sender, guitars[n].forSale);
    }

    /**
    * @dev This function retrieves sale status of all the guitar ever minted, it is meant to feed web's applications
    */

    function theseAreForSale() public view returns(bool[] memory){
        uint n = totalSupply();
        bool[] memory saleStock = new bool[](n);
        for (uint i=0; i<n; i++) {
            saleStock[i] = guitars[i].forSale;
            }
        return saleStock;
    }


    /**
    * @dev The owner of the instrument must have a payable address,
    * the guard is used because is the only function that transfer actual funds.
    * If the buyer is not a deelaer or a factory the instrument becomes used
    */

    function buyGuitar(uint _serial) external payable ifGuitarExists(_serial) isForSale(_serial) nonReentrant() {
        require(msg.value >= guitars[_serial].price, "Not enough money to buy this beauty");
        require(!hasRole(FACTORY,msg.sender), "Factories make, they do not buy");
        address ownerAddress = ownerOf(_serial);
        require(ownerAddress != msg.sender, "You already have this instrument!!");
        // This bool explainf if has a rol like dealer or factory
        bool WITHOUT_ROL = false;
        if(!(hasRole(FACTORY,msg.sender)||hasRole(DEALER,msg.sender))){WITHOUT_ROL  = true;}
        bool ONLY_DEALER_SENDER = (!hasRole(FACTORY,msg.sender))&&hasRole(DEALER,msg.sender);
        bool ONLY_DEALER_OWNER = (!hasRole(FACTORY,ownerAddress))&&hasRole(DEALER,ownerAddress);
        require(!(ONLY_DEALER_SENDER && ONLY_DEALER_OWNER), "Dealers can not trade among them");
        // cast into payble address and transfer funds to buy the address
        address(uint160(ownerAddress)).transfer(guitars[_serial].price);
        // transfer guitar property
        _transfer(ownerAddress, msg.sender, _serial);
        // Here becomes used, it was bought by a regular user
       if(WITHOUT_ROL){guitars[_serial].isNew = false;} 
       // Convey to everyone this one has already been bought
       emit ChangeGuitarOwnership(_serial, ownerAddress, msg.sender, now);
    }



}