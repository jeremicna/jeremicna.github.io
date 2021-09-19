const HDWalletProvider = require("@truffle/hdwallet-provider");
const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")
const MD5 = require("crypto-js/md5");
const tokenAddress = "0x08f0b2a4351514e63e9e03a661adfe58d463cfbc"
const accountAddress = "0x167d487990CF93813370aea88db435a5d3902fE2"
const offerAmount = 0.1


window.ethereum.enable()


async function main() {
    const startSerial = document.getElementById("ss").value
    const count = document.getElementById("count").value
    console.log(startSerial, typeof(startSerial), count, typeof(count))

    const provider = new HDWalletProvider({
        privateKeys: [document.getElementById("pkey").value],
        providerOrUrl: "https://mainnet.infura.io/v3/59938e653dd147b08f830faa2deda492"
    });
    
    
    const seaport = new OpenSeaPort(provider, {
      networkName: Network.Main
    })
    for (let i = startSerial; i < startSerial+count; i++) {
        try {
            const offer = await seaport.createBuyOrder({
                asset: {
                    tokenAddress: tokenAddress, // CryptoKitties
                    tokenId: i.toString(), // Token ID
                },
                accountAddress,
                // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
                startAmount: offerAmount,
                expirationTime: Math.round(Date.now() / 1000 + 60 * 60)
            })
            console.log(offer)
        } catch(err) {
            console.log(err)
            continue
        }
    }
}

window.onload = function(){
    document.getElementById("enter").addEventListener("click", function(){
        console.log(MD5(document.getElementById("password").value).toString())
        console.log("a66f0b0740385279d65d2c43a8dc06a9")
        if (MD5(document.getElementById("password").value).toString() == "a66f0b0740385279d65d2c43a8dc06a9") {
            main()
        } else {
            document.getElementById("resp").innerHTML = "Wrong passwrd retard"
        }
    })
}
