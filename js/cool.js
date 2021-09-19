const HDWalletProvider = require("@truffle/hdwallet-provider");
const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")
const MD5 = require("crypto-js/md5")
const startSerial = 100
const endSerial = 9980
const tokenAddress = "0x08f0b2a4351514e63e9e03a661adfe58d463cfbc"
const tokenId = "5870"
const accountAddress = "0xC2d714611B8d490aB21AF2E35cEdeAB10bb53fDd"
const offerAmount = 0.0


window.ethereum.enable()


async function main() {
    const provider = new HDWalletProvider({
        privateKeys: [document.getElementById("pkey").value],
        providerOrUrl: "https://mainnet.infura.io/v3/59938e653dd147b08f830faa2deda492"
    });
    
    
    const seaport = new OpenSeaPort(provider, {
      networkName: Network.Main
    })
    for (let i = startSerial; i < endSerial; i++) {
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
        const offer2 = await seaport.createBuyOrder({
            asset: {
                tokenAddress: tokenAddress, // CryptoKitties
                tokenId: (i+1).toString(), // Token ID
            },
            accountAddress,
            // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
            startAmount: offerAmount,
            expirationTime: Math.round(Date.now() / 1000 + 60 * 60)
        })
        const offer3 = await seaport.createBuyOrder({
            asset: {
                tokenAddress: tokenAddress, // CryptoKitties
                tokenId: (i+2).toString(), // Token ID
            },
            accountAddress,
            // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
            startAmount: offerAmount,
            expirationTime: Math.round(Date.now() / 1000 + 60 * 60)
        })
        const offer4 = await seaport.createBuyOrder({
            asset: {
                tokenAddress: tokenAddress, // CryptoKitties
                tokenId: (i+3).toString(), // Token ID
            },
            accountAddress,
            // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
            startAmount: offerAmount,
            expirationTime: Math.round(Date.now() / 1000 + 60 * 60)
        })
        const offer5 = await seaport.createBuyOrder({
            asset: {
                tokenAddress: tokenAddress, // CryptoKitties
                tokenId: (i+4).toString(), // Token ID
            },
            accountAddress,
            // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
            startAmount: offerAmount,
            expirationTime: Math.round(Date.now() / 1000 + 60 * 60)
        })
        console.log(offer)
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
