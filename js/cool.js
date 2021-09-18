const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")
const MD5 = require("crypto-js/md5")


window.ethereum.enable()


const provider = window.ethereum


const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main
})

const accountAddress = "0xC2d714611B8d490aB21AF2E35cEdeAB10bb53fDd"

const asset = {
    tokenAddress: "0xc9cb0fee73f060db66d2693d92d75c825b1afdbf", // CryptoKitties
    tokenId: "325", // Token ID
}

async function main() {
    const offer = await seaport.createBuyOrder({
        asset: {
            tokenAddress: "0xc9cb0fee73f060db66d2693d92d75c825b1afdbf", // CryptoKitties
            tokenId: "325", // Token ID
        },
        accountAddress,
        // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
        startAmount: 0.0,
        expirationTime: Math.round(Date.now() / 1000 + 60 * 60)
    })
    console.log(offer)
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
