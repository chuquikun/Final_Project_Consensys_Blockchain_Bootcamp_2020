// SPDX-License-Identifier: FGG

pragma solidity ^0.5.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title GuitarToken 
 * @dev Non-Fungible Token built on ERC721 standard, to create and transfer guitar ownership
 * @author Fernando Garduño Galaviz
 */

contract GuitarToken is Ownable, AccessControl, ERC721{
    
    mapping (uint => Guitar) public guitars;
    address public brandOwner;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    //bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    struct Guitar {
        string model;
        uint16 year;
        uint price;
        uint serial;
        string country;

    }

    /**
     * Events
     */
    event RegisteredGuitar(uint _serial);
    event ChangeGuitarOwnership(uint indexed _serial, address newOwner, uint txTime);

    
    /**
     * @dev Initializes the contract by setting a `brandName` and a `brandSymbol` to the token collection.
     */
    constructor(string memory brandName, string memory brandSymbol)
     ERC721(brandName, brandSymbol) public
      {
        brandOwner = owner(); 
        _setupRole(DEFAULT_ADMIN_ROLE, brandOwner);
        _setupRole(MINTER_ROLE, brandOwner);
        _setupRole(BURNER_ROLE, brandOwner);   
    }

    /**
     * @dev It creates a structure that accounts for a guitar construction
     * @param  _serial It is the ID for the token representing the guitar
     * @param  _model  Type of guitar 
     * @param _year Manufacture year
     * @param _price Value that must be paid to get the token
     * @param _country Manufacture country
     */
    function mintGuitarToken(
        uint _serial,
        string memory _model,
        uint16 _year,
        uint _price,
        string memory _country
        )
        public
        {
        /// only a manufacturer with MINTER_ROLE must call this function
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        /// serialnumber must be unique
        require(!_exists(_serial),"There's already a token identified by this serial number.");
        guitars[_serial] = Guitar(_model, _year, _price, _serial, _country);
        _safeMint(msg.sender, _serial);
        emit RegisteredGuitar(_serial);
        /// sets the ownership of the instrument to the manufacturer
        emit ChangeGuitarOwnership(_serial, msg.sender, now);
    }


}