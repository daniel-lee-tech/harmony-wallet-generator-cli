const { Wallet } = require('@harmony-js/account');
const { generateCustomMessenger, checkProperNetworkIdInput } = require('./utils');
const { folderNames } = require('./constants');
const path = require('path');

// include file system module
const fs = require('fs');

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



rl.question("Which network will this wallet be imported for? \n 1 for mainnet \n 2 for testnet \n 3 for local\n", function (networkId) {
    checkProperNetworkIdInput(networkId);

    // create a custom messenger
    const customMessenger = generateCustomMessenger(Number.parseInt(networkId));

    // create a new Wallet object
    const newWallet = new Wallet(customMessenger);

    const directoryPath = path.join(__dirname, "wallets", folderNames[networkId]);

    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        console.log("current wallet files: ")

        files.forEach(function (file) {
            console.log(file);
        });

        rl.question("Please enter file name: ", function (fileName) {
            const directoryPath = path.join(__dirname, "wallets", folderNames[networkId]);
            const fullFilePath = path.join(directoryPath, fileName);


            // read file sample.json file
            fs.readFile(fullFilePath,
                // callback function that is called when reading file is done
                function (err, data) {
                    if (err) {
                        console.log("does this wallet file exist? please try again!")
                        process.exit();
                    }

                    // json data
                    var jsonData = data;

                    // parse json
                    var jsonParsed = JSON.stringify(JSON.parse(jsonData));

                    rl.question("Please enter the password for this account ", function (password) {
                        newWallet.addByKeyStore(jsonParsed, password).then(res => {
                            console.log(res)
                        }).catch(err => {
                            console.log(err);
                            console.log("Is your password correct?");
                        });

                        process.exit();
                    });
                }
            );

        })
    });
});