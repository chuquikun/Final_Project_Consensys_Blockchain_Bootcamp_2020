# Avoiding Common Attacks

## Re-entracy Attack

The only function managing ethers on the contracts is the *buyGuitar* function and I shielded it using a guard provided by the *ReentrancyGuard.sol*
contract, so this function can only be called once at a time.

## Integer Overflow and Underflow 

I used SafeMath.sol even for basic additon and substraction to avoid overflow, I also used *require* statement in the function where the user should input numeric values to assure the numbers passed to the functions were in the proper rank. For example the funciton *cahgePrice* the user should provide a new price but to fullfill the execution, it must pass this statement,
require( _newPrice < _newPrice+1 && _newPrice > 0).

## Input Validation

In addition to the measures taken before, I validated all the inputs supplied by the users and try to automatize every possible input like the serial number in the minting. The most sensible inputs were those related with the prices  and I used modifier and therequire function to check them before proceed to execution of transactions.
