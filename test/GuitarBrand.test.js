const { assert } = require('chai')

const GuitarBrand = artifacts.require("GuitarBrand")

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('GuitarBrand', (accounts) =>{

    let contract
    let owner
    let factory
    let dealer
    let factoryUp 
    let dealerUp

    const usaFactory = accounts[0];
    const mexFactory = accounts[1];
    const amSupply = accounts[2];
    const zzZounds = accounts[3];
    const hendrix = accounts[4];
    const gilmour = accounts[5];
    const guitarLessDude = accounts[6];
     
    //DEALER'S ROLE '0x31fec149acb2a6e0b1854d0fdb3f23210598a76b4f5f5d9f688154dbc523766f'
    //FACTORY'S ROLES '0x547b500e425d72fd0723933cceefc203cef652b4736fd04250c3369b3e1a0a73'



    before(async () =>{
        contract = await GuitarBrand.deployed()
        owner = await contract.owner()
        factory = await contract.FACTORY()
        dealer = await contract.DEALER()
        factoryUp = await contract.grantRole(factory, mexFactory, {from:owner})
        dealerUp = await contract.grantRole(dealer, amSupply, {from:mexFactory})
        ealerUp = await contract.grantRole(dealer, zzZounds, {from:mexFactory})
    })

    
   /**
   * This stage of tests  assert if the deployment of the  was correct and grants the proper roles to the owner of the brand
   */

    describe('deployment', async() =>{
        it('well deployed', async() =>{
            const address = contract.address
            const result = (address && address!=0x0)? true : false
            assert.notEqual(result, false)
        })
        it('correct token brand name assignation', async() =>{
            const name = await contract.name()
            assert.equal(name, 'Fenfer')
        })     
        it('correct token brand symbol assignation', async() =>{
            const symbol = await contract.symbol()
            assert.equal(symbol, 'FNR')
        })
        it('the brand owner is the administrator', async() =>{
            const admin = await contract.DEFAULT_ADMIN_ROLE()
            const isAdmin = await contract.hasRole(admin, owner)
            assert.equal(isAdmin, true, 'The deployer is the owner of the brand.')
        })
        it('general admin rules factories and factories rule dealers', async() =>{           
            const factoryAdmin = await contract.getRoleAdmin(factory)
            const dealerAdmin = await contract.getRoleAdmin(dealer)
            assert.equal(factoryAdmin, 0x0, 'The general admin is the admin for factories')
            // Used web3.utils.keccak256("FACTORY") to get the encoded rol
            assert.equal(dealerAdmin, '0x547b500e425d72fd0723933cceefc203cef652b4736fd04250c3369b3e1a0a73', 'The admin for dealers are the factories')
        })
       
    })

    /**
     * Checks if roles are designated or revoked by their admins and if the events:
     * NewFactory, ClosedFactory, subDealear, unsubDealer are correctly triggered correctly
     */
    describe('correct role managing',async() =>{
        it('correct assignation of roles', async() =>{
            // Checks factory role was correctly assigned to the account and the proper log was emitted
            const event1 = factoryUp.logs[0].args
            let isFactory = await contract.hasRole(factory, mexFactory)
            assert.isTrue(isFactory, 'Factory role was assigned correctly');
            assert.equal(event1.account, mexFactory, 'The log for sign up a factory role was correct')
            // Checks dealer role was correctly assigned to the account and the proper log was emitted
            const event2 = dealerUp.logs[0].args
            let isDealer = await contract.hasRole(dealer, amSupply)
            assert.isTrue(isDealer, 'Dealer role was assigned correctly');
            assert.equal(event2.account, amSupply, 'The log for sign up a dealer role was correct')           

        })
        it('correct destitution of roles', async() =>{
            // Checks factory role was correctly revoke to the account and the proper log was emitted  
            const dealerDown = await contract.revokeRole(dealer, amSupply, {from:mexFactory})
            const event1 = dealerDown.logs[0].args
            let isNotDealerAnymore = await contract.hasRole(dealer, amSupply)
            assert.isFalse(isNotDealerAnymore, 'Dealer role was revoked correctly')
            assert.equal(event1.account, amSupply, 'The log for unsubscribe dealer role was correct')
            // restitution of their roles for further tests
            await contract.grantRole(dealer, amSupply, {from:mexFactory})
            
            
            // Checks dealer role was correctly revoked to the account and the proper log was emitted         
            const factoryDown = await contract.revokeRole(factory, mexFactory, {from:owner})
            const event2 = factoryDown.logs[0].args
            let isNotFactoryAnymore = await contract.hasRole(factory, mexFactory)         
            assert.isFalse(isNotFactoryAnymore, 'Factory role was revoked correctly')
            assert.equal(event2.account, mexFactory, 'The log for unsubscribe factory role was correct')
            // restitution of their roles for further tests
            await contract.grantRole(factory, mexFactory, {from:owner})
        })
    })

    /**
     * This stage of test asserts the functionality to create new guitars
    */

    describe('minting', async() =>{
        it('number of guitars made',async() =>{
            await contract.mintGuitar("telecaster", 10000, {from:usaFactory})
            result = await contract.totalSupply()
            assert.equal(result, 1, 'First guitar minted!!!!')
        })
        it('they can mint', async()  =>{
            await contract.mintGuitar("stratocaster", 10000, {from:mexFactory})
            result = await contract.totalSupply()
            assert.equal(result, 2, 'Your first strat!!!!')
        })
        it('they can not mint', async() =>{
            await contract.mintGuitar("stratocaster", 10000, {from:amSupply}).should.be.rejected;
            await contract.mintGuitar("stratocaster", 10000, {from:hendrix}).should.be.rejected;  
        })
        it('guitar well minted', async()  =>{
           await contract.mintGuitar("jazzmaster", 10000, {from:mexFactory})
           const lastGuitarIndex = await contract.totalSupply()-1
           const guitar = await contract.guitars(lastGuitarIndex)
           assert.equal(guitar.model.toString(10), 'jazzmaster', 'The model was recorded correctly')
           assert.equal(guitar.price.toString(10), '10000', 'Price was recorded correctly')
           assert.equal(guitar.serial.toString(10), '3', 'Serial number was recorded correctly')
           assert.equal(guitar.factory.toString(10), mexFactory, 'The address of guitar maker is right')
           assert.equal(guitar.isNew.toString(10), 'true', 'The guitar is new')
           assert.equal(guitar.forSale.toString(10), 'true', 'The guitar is for sale')
        })
        it('guitar creation logs are triggered well', async()  =>{
           const result = await contract.mintGuitar("jaguar", 10000, {from:mexFactory})
           supply = await contract.totalSupply()
           const events = result.logs
           assert.equal(events[1].args._serial, supply.toString(10), "Serial number for the log of NewGuitarMinted works fine")
           assert.equal(events[2].args._serial, supply.toString(10), "Serial number for the log of ChangeGuitarOwnership works fine")
           assert.equal(events[2].args.previousOwner, 0x0, "This is a brand new guitar")
           assert.equal(events[2].args.newOwner, mexFactory, "The manufacturer is the original owner of the instrument")

        }) 
    })
    /**
     * This group of test check the reassignation of prices works
     */
    describe('changing price', async() =>{
        it('allowed prices are assigned', async() =>{
           await contract.changePrice(1, 20000, {from:usaFactory})
           const firstGuitar = await contract.guitars(0)
           assert.equal(firstGuitar.price.toString(10), '20000', "The first guitar ever made raised its price")
        })
        it('prevents overflow', async() =>{
            await contract.changePrice(1, Math.pow(2,256), {from:usaFactory}).should.be.rejected;
        })
        it('can not change because caller is not the owner', async() =>{
            await contract.changePrice(1, 30000, {from:mexFactory}).should.be.rejected;
        })
        it('to change price must set a different from previous one', async() =>{
            await contract.changePrice(1, 20000, {from:usaFactory}).should.be.rejected;
        })
        it('guitar must exist to change its price', async() =>{
            supply = await contract.totalSupply()
            await contract.changePrice(supply+1, 20000, {from:usaFactory}).should.be.rejected;
        })

    })
    describe('changing price', async() =>{
        it('changes status correctly', async() =>{
            supply = await contract.totalSupply()
            const prevStatus = contract.guitarData(supply).then((res) => {return res})
            const currOwner = await contract.ownerOf(supply)
            await contract.changeSaleStatus(supply, {from:currOwner})
            const currStatus = contract.guitarData(supply).then((res) => {return res})
            assert.notEqual(prevStatus, currStatus, "Change the status correctly")
        })
        it('only the owner can put this product for sale', async() =>{
            supply = await contract.totalSupply()
            const currOwner = await contract.ownerOf(supply)
            await contract.changeSaleStatus(supply, {from:guitarLessDude}).should.be.rejected;
        })

    })
    describe('buying guitars', async() =>{

        it('user bought from dealer', async()=>{
            await contract.buyGuitar(3, {from:hendrix, value:10000})
            const result = await contract.ownerOf(3)
            assert.equal(result, hendrix,"Hedrix has a new guitar!")            
         })
         it('user bought from other user', async()=>{
            await contract.buyGuitar(3, {from:gilmour, value:10000})
            const result = await contract.ownerOf(3)
            assert.equal(result, gilmour,"NGD for Gilmour!")            
         })
        it('user bought from factory', async()=>{
            await contract.buyGuitar(1, {from:gilmour, value:20000})
            const result = await contract.ownerOf(1)
            assert.equal(result, gilmour,"NGD for Gilmour!")   
        })
        // amSupply bought from gilmour
        it('dealer bought from user', async()=>{
            await contract.buyGuitar(3, {from:amSupply, value:10000})
            const result = await contract.ownerOf(3)
            assert.equal(result, amSupply,"amSupply has new 2nd hand guitar!")   
        })
        it('user dealer from facto', async()=>{
            await contract.buyGuitar(2, {from:amSupply, value:10000})
            const result = await contract.ownerOf(2)
            assert.equal(result, amSupply,"Hedrix has a new guitar!")            
         })
        it('dealer cant buy dealer', async()=>{
            await contract.changeSaleStatus(4, {from:mexFactory})
            await contract.buyGuitar(4, {from:zzZounds, value:10000}).should.be.rejected
        })
        it('fabrics can not buy', async()=>{      
            await contract.buyGuitar(4, {from:usaFactory, value:10000}).should.be.rejected
        })
        it('can not buy what does not exist', async()=>{
            await contract.buyGuitar(10, {from:usaFactory, value:10000}).should.be.rejected
        })
        it('can not buy i,t if it is not for sale', async()=>{
            await contract.changeSaleStatus(2, {from:amSupply})
            await contract.buyGuitar(2, {from:hendrix, value:10000}).should.be.rejected
        })

    })
    describe('sale booleans', async()=>{
        it('number of guitars for sale',async()=>{
            const stock = await contract.theseAreForSale().then((res) => {return(res.reduce((sum, next) => sum + next, false))})
            //Up to this moment it should be 3 guitars for sale
            assert.equal(stock, 3, "Your stock for sale is correct")        
        })
    })

})
