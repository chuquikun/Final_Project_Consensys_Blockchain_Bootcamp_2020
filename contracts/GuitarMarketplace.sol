pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./GuitarBrand.sol";

/**
 * @title GuitarMarketplace
 * @dev This contract represents a market for guitars brands any brand's owner
 * can sign in his brand after market's aprroval, granted for any other brand owner.
 * This behaviour could be improved transforming the marketplace into a multi-signed contract.
 * @author Fernando Garduño
 */

contract GuitarMarketplace is Ownable, AccessControl{

    mapping (address =>  bool) public brandOwners;
    /// @dev Just check if the brand has already been registered
    mapping (string =>  bool) public brandExistence;
    mapping (string =>  GuitarBrand) public brands;

    // Roles' encoding
    bytes32 public constant ADMIN = keccak256("ADMIN"); 


    /**
    * Events
    */
    event BrandOwnerAdded(address indexed addr);
    event BrandOwnerRemoved(address indexed addr);
    event GuitarBrandSignedUp(string indexed name);
    event GuitarBrandSignedDown(string indexed name);

    /**
     * @dev The contract's deployer becomes an 'ADMIN'
     * only the accounts with this rol can sing up or down a guitar brand into the marketplace.
     * An admin can either grant or revoke this role using granRole/revokeRol functions from AccesControl
     *
     */
    constructor() public {
        brandOwners[owner()] = true;
        _setupRole(ADMIN, owner());
        _setRoleAdmin(ADMIN, ADMIN);  
    }

    /**
     * @dev It creates a structure that accounts for a guitar construction
     * this structure it's related to the token set in the contructor function
     */
    function brandSignUp(address _brandAddress) public returns(bool) {
        // only a factory with factory must call this function
        require(hasRole(ADMIN, msg.sender), "Addres is not been granted permission to sign up for guitar brands");
        GuitarBrand brand = GuitarBrand(_brandAddress);
        require(brand.brandOwner() == msg.sender, "Only brand owner is allowed to sign up his brand");
        string memory brandName = brand.name();
        require(brandExistence[brandName] == true, "That brand is already registered");
        brands[brandName] = brand;
        brandExistence[brandName] = true;
        emit GuitarBrandSignedUp(brandName);
        return true;
    }


}