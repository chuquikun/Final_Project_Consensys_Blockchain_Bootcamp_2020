App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load guitars.
    $.getJSON('../guitars.json', function(data) {
      var guitarsRow = $('#guitarsRow');
      var guitarTemplate = $('#guitarTemplate');

      for (i = 0; i < data.length; i ++) {
        guitarTemplate.find('.panel-title').text(data[i].serial);
        guitarTemplate.find('img').attr('src', data[i].picture);
        guitarTemplate.find('.guitar-model').text(data[i].model);
        guitarTemplate.find('.guitar-price').text(data[i].price);
        guitarTemplate.find('.btn-sale').attr('data-id', data[i].serial);
        guitarTemplate.find('.btn-buy').attr('data-id', data[i].serial);

        guitarsRow.append(guitarTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
   // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('GuitarBrand.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var GuitarBrandArtifact = data;
      App.contracts.GuitarBrand = TruffleContract(GuitarBrandArtifact);
    
      // Set the provider for our contract
      App.contracts.GuitarBrand.setProvider(App.web3Provider);
    
      
      return App.getStockforSale();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-sale', App.handleSaleState);
    $(document).on('click', '.btn-buy', App.handleBuyGuitar);
  },
  
  // return ll the guitars for sale 
  getStockforSale: function() {
    var GuitarBrandInstance;

    App.contracts.GuitarBrand.deployed().then(function(instance) {
      GuitarBrandInstance = instance;
    
      return GuitarBrandInstance.theseAreForSale.call();
    }).then(function(guitars) {
      for (i = 0; i < guitars.length; i++) {
        let text4SaleSatus;
        if (guitars[i]) {
          text4SaleSatus = "Selling";
        } else{
          text4SaleSatus = "Not for sale";
        }
          $('.panel-guitar').eq(i).find('.btn-sale').text(text4SaleSatus);
      }
    }).catch(function(err) {
      console.log(err.messprice);
    });
  },

  handleSaleState: function(event) {
    event.preventDefault();

    var guitarId = parseInt($(event.target).data('id'));

    var GuitarBrandInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.GuitarBrand.deployed().then(function(instance) {
        GuitarBrandInstance = instance;
    
        // change the sale status for the guitar
        return GuitarBrandInstance.changeSaleStatus(guitarId, {from: account});
      }).then(function(result) {
        return App.getStockforSale();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },


  handleBuyGuitar: function(event) {
    event.preventDefault();

    var guitarId = parseInt($(event.target).data('id'));

    var GuitarBrandInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.GuitarBrand.deployed().then(function(instance) {
        GuitarBrandInstance = instance;
        // Execute the transaction to buy a guitar from the logged account
        return GuitarBrandInstance.buyGuitar(guitarId, {from: account, value:"5000000000000000000"});
      }).then(function(result) {
        return App.getStockforSale();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }  

  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
