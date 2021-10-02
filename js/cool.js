const HDWalletProvider = require("@truffle/hdwallet-provider");
const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")
const MD5 = require("crypto-js/md5");
const accountAddress = "0xC2d714611B8d490aB21AF2E35cEdeAB10bb53fDd"


window.ethereum.enable()


async function main() {
    const targetSerials = document.getElementById("serials").value.split(" ")
    console.log(targetSerials.length)
    const tokenAddress = document.getElementById("colltoken").value
    const offerAmount = parseFloat(document.getElementById("offeramount").value)
    const startSerial = parseInt(document.getElementById("ss").value)
    const count = parseInt(document.getElementById("count").value)
    const hours = parseInt(document.getElementById("expiry").value)
    console.log(startSerial, typeof(startSerial), count, typeof(count), tokenAddress, typeof(tokenAddress), offerAmount, typeof(offerAmount), hours, typeof(hours))

    const provider = new HDWalletProvider({
        privateKeys: [document.getElementById("pkey").value],
        providerOrUrl: "https://eth-mainnet.alchemyapi.io/v2/98FU1uo1p9pfp6KV2iS8GEi3Ny4JD5zR"
    });
    
    
    const seaport = new OpenSeaPort(provider, {
      networkName: Network.Main
    })
    for (let i = startSerial; i < startSerial+count; i++) {
        try {
            const offer = await seaport.createBuyOrder({
                asset: {
                    tokenAddress: tokenAddress, // CryptoKitties
                    tokenId: targetSerials[i], // Token ID
                },
                accountAddress,
                // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
                startAmount: offerAmount,
                expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * hours)
            })
            console.log(offer)
        } catch(err) {
            console.log(err)
            continue
        }
    }
    console.log("run done")
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
