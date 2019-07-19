// App - app object
App = {
    load: async () => {
        console.log('app loading...');
    }
}

$(() => {   //DOMReady
    console.log('dom ready...');
    $(window).load(() => {  //window.onload
        App.load();
    });
});