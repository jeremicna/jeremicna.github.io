const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")
const MD5 = require("crypto-js/md5")
const startSerial = 100
const endSerial = 9980
const tokenAddress = "0x60e4d786628fea6478f785a6d7e704777c86a7c6"
const tokenId = "789"
const accountAddress = "0xc2d714611b8d490ab21af2e35cedeab10bb53fdd"


window.ethereum.enable()


const provider = window.ethereum


const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main
})


async function main() {
    //for (let i = startSerial; i < endSerial; i++) {
        const offer = await seaport.createBuyOrder({
            asset: {
                tokenAddress: tokenAddress, // CryptoKitties
                tokenId: tokenId, // Token ID
            },
            accountAddress,
            // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
            startAmount: 0.00,
            expirationTime: Math.round(Date.now() / 1000 + 60 * 60)
        })
        console.log(offer)
    //}
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
