const { HttpProvider, Messenger } = require('@harmony-js/network');
const { harmonyUrls } = require('./constants');
const { ChainType } = require('@harmony-js/utils');


// create a custom messenger
function generateCustomMessenger(networkId) {
    return new Messenger(
        new HttpProvider(harmonyUrls[networkId]),
        ChainType.Harmony, // if you are connected to Harmony's blockchain
        Number.parseInt(networkId),
    );
}

function checkProperNetworkIdInput(networkId) {
    if (!["1", "2", "3"].includes(networkId)) {
        console.log("Wrong network Id, please enter 1, 2, or 3");
        process.exit();
    }
}

module.exports = {generateCustomMessenger, checkProperNetworkIdInput}