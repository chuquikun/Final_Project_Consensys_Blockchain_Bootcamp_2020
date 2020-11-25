pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";

import "./GuitarToken.sol";

/**
 * @title GuitarMarketplace
 * @dev 
 * @author Fernando Garduño
 */
contract Marketplace is Ownable, Pausable {

mapping (string => bool) public brandNames;
mapping (string => bool) public brandSymbols;
/// It maps  to all the brands address owned by an account 
mapping (address => address[]) public ownerBrands; 
// @dev It's called factories because it produces the token for each brand 
//  but also keep it's registry of ownership because is ERC721
mapping(address => GuitarToken[]) public factories;

constructor (address[] memory _brandOwners, string[] memory _brandNames, string[] memory _brandSymbols) pubilc{
    /// The arrays must have the same length
    require(_brandOwners.length == _brandOwners.length == _brandSymbols);
    /// Instantiate a toekn for each guitar brand
    for(uint _i=0; _i<_brandOwners.length; _i++){
         /// Guitar brands and their symbols must be unique
        require(!brandNames[_brandNames[_i]] && !brandSymbols[brandSymbols[_i]]);
        GuitarToken gt = new GuitarToken(_brandNames[_i], _brandSymbols[_i]);
        ownerBrands[_brandOwners[_i]].push(gt.address);
        factories[gt.address] = gt

    }

}



}

