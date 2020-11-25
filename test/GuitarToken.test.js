const { assert } = require('chai')

const GuitarToken = artifacts.require("GuitarToken")

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('GuitarToken', ()=>{

    let contract
    let owner
    before(async ()=>{
        contract = await GuitarToken.deployed()
        owner = await contract.owner()
    })

    describe('deployment', async()=>{
        it('well deployed', async()=>{
            const address = contract.address
            const result = (address && address!=0x0)? true : false
            assert.notEqual(result, false)
        })
        it('correct token brand name assignation', async () => {

            const name = await contract.name()
            assert.equal(name, 'Fender')
        })     
        it('correct token brand symbol assignation', async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'FNR')
        })
        it('the brand owner is the administrator', async () =>{
            const admin = await contract.DEFAULT_ADMIN_ROLE()
            const isAdmin = await contract.hasRole(admin, owner)
            assert.equal(isAdmin, true, 'The deployer must have admin permissions.')
        })
        it('the brand owner is the minter', async () =>{
            const minter = await contract.MINTER_ROLE()
            const isMinter = await contract.hasRole(minter, owner)
            assert.equal(isMinter, true, 'The deployer must be a minter.')
        })     
        
    })
})
