
const { Wallet } = require('@harmony-js/account');
const { generateCustomMessenger, checkProperNetworkIdInput } = require('./utils');
const fs = require('fs');
const path = require('path');


const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { folderNames } = require('./constants');


rl.question("Which network will this wallet live \n 1 for mainnet \n 2 for testnet \n 3 for local\n", function (networkId) {
    checkProperNetworkIdInput(networkId);

    // create a custom messenger
    const customMessenger = generateCustomMessenger(Number.parseInt(networkId));

    // create a new Wallet object
    const newWallet = new Wallet(customMessenger);

    rl.question("Please enter a password, please remember this password! ", function (password) {
        newWallet.createAccount().then(async newAccount => {
            console.log(newAccount)

            // get new mnemonic for wallet
            // this mnemonic will be used to generate a private key and Account object
            const newMnemonic = newWallet.newMnemonic();
            console.log(newMnemonic)

            // there is no direct getter for private key, 
            // but you can access the private key through the file generator function on the Account object.
            const file = await newAccount.toFile(password);
            const directoryPath = path.join(__dirname, "wallets", folderNames[networkId], newAccount.bech32Address + '.json');
            console.log(directoryPath);
            console.log(file);

            fs.writeFileSync(
                directoryPath,
                file,
                () => process.exit()
            );
        });
    });
});