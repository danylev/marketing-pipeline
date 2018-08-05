const Promise = require('bluebird');
const Nick = require("../../lib/Nick");
const nick = new Nick({
    headless: true,
    timeout: 30000,
    debug: true,
});

const runTab = async () => {
    const tab = await nick.newTab();
    await tab.open('https://www.tradesy.com/i/hermes-brown-border-silk-twill-90-cm-scarfwrap/22902226/');
    //await tab.untilVisible("body");
    //await tab.inject(`examples/es8/jquery-3.2.1.min.js`);
    //await tab.wait(3000);
    //await tab.scrollToBottom();

    //const results = await tab.evaluate((arg, callback)=>{
    //    const blocks = $("body").find('div');
    //    callback(null, blocks.length);
    //});
    //console.log(`Number of divs: ${results}`)

    await tab.close();
};

const runTestTabs = () => {
    const fakeArray = new Array(1000);

    return Promise.each(fakeArray, () => {
        return Promise.all([runTab(), runTab(), runTab()])
    });
}

(async ()=> {
    await runTestTabs();
    console.log("Test complete!");
    nick.exit();
})();
