// App - app object
App = {
    contracts: {},
    loading: false,
    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
          } else {
            window.alert("Please connect to Metamask.")
          }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */});
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */});
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    },

    loadAccount: async () => {
        App.account = web3.eth.accounts[0];
        console.log(App.account);
    },

    loadContract: async() => {
        const todoList = await $.getJSON('TodoList.json');
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(App.web3Provider);

        console.log(todoList);
        console.log(App.contracts.TodoList);

        App.todoList = await App.contracts.TodoList.deployed();

        console.log(App.todoList);
    },

    render: async () => {
        if (App.loading) {
            return
        }

        // Loading
        App.setLoading(true);

        $('#account').html(App.account);

        // Loading finished
        App.setLoading(false);
    },

    setLoading: (loading) => {
        App.loading = loading;

        if(App.loading) {
            $('#loader').show();
            $('#content').hide();
        } else {
            $('#loader').hide();
            $('#content').show();
        }
    }
}

$(() => {   //DOMReady
    $(window).load(() => {  //window.onload
        App.load();
    });
});