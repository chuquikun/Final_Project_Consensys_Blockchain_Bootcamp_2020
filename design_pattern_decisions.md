# Design Patterns

For the implementation of some of these design patterns I have used OpenZepplin's OpenZeppelin Solidity library, which contains secure, community-audited smart contract security patterns.

My web online app just implments basic functionality of the smart contract to trade instruments and stop sales publications based on roles, but the smart contract [GuitarBrand.sol](https://github.com/chuquikun/Final_Project_Consensys_Blockchain_Bootcamp_2020/blob/master/contracts/GuitarBrand.sol) that supports the backend is more complex and it was written following several design patterns.

## Circuit Breaker
I used the contract *Pausable.sol* by OpenZeppelin that implments several modifiers to stop some designated functionality, in my case I used the circuit breaker provided by the modifier *whenNotPaused* to stop the minting or building of new guitars and the granting or revoking of roles.This was thinking in the case the Guitar run out of business, so in that way the productionis stopped but the owner of the already built guitars can still  trade them.

## Restricting Access
I used the contract *AccesControl.sol* by OpenZeppelin to assign roles and in conjunction with some modifiers I restricted some tasks and functionalities to the users of the contract, for example only the *factories* can mint new instruments, only *dealers and factories* can sell new instruments and only the BrandOwner can stop the contract.

## Fail Early and Fail Loud
Using the require function and several modifiers we can stop execution of commands, throwing exception and informing the reason why the execution was not succesful. Thanks to this we can see in Metamask alerts that prevent us to run  unsuccessful transaction.

## Token Factory
I used the *ERC721.sol* implementation of the standard for Non Fungible Tokens because every instrument should be treated as a collectible and every instance of my would be a new Guitar Brand capable of build instruments. Thanks to this contract we ca use all the methods mentioned in the interfaces *IERC721Metadata.sol* and
*IERC721Enumerable.sol*, that are pretty useful to keep track of the ownership of the instruments altough I didn used UIR parameter of themetadata interface this can be used to refer to photos or COA of the instruments.

