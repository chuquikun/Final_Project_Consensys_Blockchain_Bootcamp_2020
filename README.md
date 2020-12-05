# Guitar registry and trade platform 

## Premise :
  
  The idea was to create a platform where the people could trade instruments with the certainty that the instruments are original, thanks to blockchain we have a  inmutable ledger of all the transactions and the history of each instrument from the building, and passing from hand to hand until the current owner.\
  Also, the users could be more aware of the prices of the instruments in the time  so they would have more tools to decide if it is a good buying or not.\
  In the other hand we are providing a great management and recording tool for the productions of the brand, so the owner could be more aware of the situtaion of his company.


## The contract :

  It has all the logic neecssary to deploy a new guitar brand to the blockchain environment, so a big manufcturer or small one could use it to relate his brand to a contract address. \
  The brand owner and deployer will manage his parterns by granting the roles of  **factories** or **dealers** to them, the owner is also by default the first factory. \
  The factories has the right to **"mint"** or build new instrument, both roles has are the only ones that can sell new instruments. To be a delaer you must have a partnership with a factory so the factories manage this roles and can revoke them or grant them.
  Finally the regular users could use the contract or the application to buy and re-sell the guitars built by the brand, if the sell the instruments it would be as seond hand instruments.\
  Each owner of instrument will have the rigth tochange the sales status of his sinstruments any time. If the company goes out of business the owner will have the ability to pause the manufacturing of new guitars, but the guitars owner cwill be able to trade thier instruments yet.
 
## WebApp : 
  
  The applications is an online guitar store for a specific brand whose backend is supported by smart contract that runs and records all the transactions on the blockchain. 
  
### User Stories:
  The owners of the instruments has the right to stop or reactivate the selling of their instruments, anyone but the factories may buy the avilable instruments.
  The web app can recognize the rol of the address visiting the page depending on this, the apps reacts different:\
  
  ⋅⋅⋅As a *factory*: A user with this role can only stop the sale status of the instruments that he has built, because ther are mean to build new instruments not to bhuy tem. ⋅⋅
  
  ⋅⋅⋅As a *dealer*: Can sell isntruments from reuglar owner or factories, the sales  status after the sale is going to be *selling* meaning that the guitar is for sale, because the dealers buy the instruments to resell them. Also internally in the contract the state of the is instrument is ket *New* if the dealer buy from fatory or *Used*  if the previous owner was a regular one.⋅⋅
  
  ⋅⋅⋅As a *regular user*⋅⋅: A user can buy listed instruments or resell his. After buying a instrument the sales status is going to change automatically to *Not for sale* because it is supossed that a regular user buy the instruments to keep them, if it is not the case he can change that status any time.
  

## Requirements

1. Clone this repository:
```
   git clone https://github.com/chuquikun/Final_Project_Consensys_Blockchain_Bootcamp_2020/edit/master/README.md
```
2. Install ganache command line interface :
```
   npm install -g ganache-cli   
```
3. Install truffle :
```
   npm install -g truffle
```
4. Install all the required dependencies, on the cloned repository's root :
```
   npm install
```

## Running the tests

On project's directory.

1. Run a ganache network on port 8545:
```
   ganache-cli -p 8545 
```
2. Compile contract and deploy it to development's network. In a different terminal on project's directory :
```
   truffle compile
   truffle migrate --network development
```
3. Run the tests :
```
   truffle test
```
A demo running and passing the test can be seen on [this video](https://www.youtube.com/watch?v=qSPQhSKc4e8)

## Running the app

Same steps 

1. Run a ganache network on port 8545:
```
   ganache-cli -p 8545 
```
2. Compile contract and deploy it to development's network. In a different terminal on project's directory :
```
   truffle compile
   truffle migrate --network development
```
3. Launch the app on local server :
```
   npm run dev 
```
**Note: if you launch the app after running the test not only your first account is going to have balance less than 100 ETH because the tests perform transaction on the development network that cost ETH.**

4. Follow the step in [this document](https://github.com/chuquikun/Final_Project_Consensys_Blockchain_Bootcamp_2020/blob/master/notes_for_demo.txt) to match the data in the web app.

A full demo can be seen on [this video](https://www.youtube.com/watch?v=qSPQhSKc4e8)

## Comments on Metamask

You must import the mnemonic that was generatedby ganache at the moment of running the development network, after that the network on the metamask wallet should    be localhost:8545 to make the guitar store application work.

## Last comments

This applications is a first step to develop a full marketplace like [Reverb](https://reverb.com/), where there could be many instances of the contract exposed here to represent different brands, but with the peculiarity that it would be  governed by the different Guitar Brands. I also think it would be necessary to add MultiSig function to let new brands enter to de marketplace to avoid a monopoly.



