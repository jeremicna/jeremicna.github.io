const HDWalletProvider = require("@truffle/hdwallet-provider");
const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")
const MD5 = require("crypto-js/md5");
var accountAddress = ""
var alchemy = ""
var active = true


// ADD DOUBLE CLICK TO GO TWICE AS FAST WITH ARRAY TO NOT DO THEM TWICE
// NOTIFY WHEN MARGIN GETS CLAPPED
// AUTOMATION


window.ethereum.enable()


async function main() {
    console.log("STARTED PISSMODE")
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
        providerOrUrl: alchemy
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
                console.log(i, offer)
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
        console.log("08d73df56eabed0bb5dec9346fd8570b")

        if (MD5(document.getElementById("password").value).toString() == "a66f0b0740385279d65d2c43a8dc06a9") {
            accountAddress = "0x167d487990cf93813370aea88db435a5d3902fe2"
            alchemy = "https://eth-mainnt.alchemyapi.io/v2/98FU1uo1p9pfp6KV2iS8GEi3Ny4JD5zR"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "08d73df56eabed0bb5dec9346fd8570b") {
            accountAddress = "0xc5fdeF0fF84be777E045d2cB05359d3Fc66f9023"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/uWdYeNPjRbGTEzefSyCw6ay4qAS5OOJf"
            main()
        } else {
            document.getElementById("resp").innerHTML = "Wrong passwrd retard"
        }
    })
}
