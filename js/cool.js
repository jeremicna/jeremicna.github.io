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


//window.ethereum.enable()


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
    document.getElementById("fetch").addEventListener("click", function(){
        console.log("Sheesh you clicked")
        fetch("https://os-master.fruitbarrel.repl.co").then(function(response) {
            return response.json()
        }).then(function(data){
            console.log(data)
            const tokenAddress = document.getElementById("colltoken").value
            let collectionName = data["collections"][tokenAddress]["collection_name"]
            let collectionDescription = data["collections"][tokenAddress]["collection_description"]
            let floorPrice = data["collections"][tokenAddress]["floor_price"]
            let listingCount = data["collections"][tokenAddress]["listing_count"]
            let bidCount = data["collections"][tokenAddress]["bid_count"]
            let updatedAt = new Date(data["collections"][tokenAddress]["updated_at"]*1000)
            let listedSerialString = ""

            for (let key in data["collections"][tokenAddress]["listed_serials"]) {
                listedSerialString += key + " "
            }

            document.getElementById("serials").value = listedSerialString
            document.getElementById("collection_name").innerHTML = collectionName
            //document.getElementById("collection_description").innerHTML = collectionDescription
            document.getElementById("token_address").innerHTML = tokenAddress
            document.getElementById("floor_price").innerHTML = "Floor Price: " + floorPrice
            document.getElementById("listing_count").innerHTML = "Listing Count: " + listingCount
            document.getElementById("bid_count").innerHTML = "Bid Count: " + bidCount
            document.getElementById("updated_at").innerHTML = "Updated At: " + updatedAt

            document.getElementById("0.05_bbc").innerHTML = "BB@5%: " + data["collections"][tokenAddress]["0.05_bbc"]
            document.getElementById("0.10_bbc").innerHTML = "BB@10%: " + data["collections"][tokenAddress]["0.1_bbc"]
            document.getElementById("0.15_bbc").innerHTML = "BB@15%: " + data["collections"][tokenAddress]["0.15_bbc"]
            document.getElementById("0.20_bbc").innerHTML = "BB@20%: " + data["collections"][tokenAddress]["0.2_bbc"]
            document.getElementById("0.25_bbc").innerHTML = "BB@25%: " + data["collections"][tokenAddress]["0.25_bbc"]
            document.getElementById("0.30_bbc").innerHTML = "BB@30%: " + data["collections"][tokenAddress]["0.3_bbc"]
            document.getElementById("0.35_bbc").innerHTML = "BB@35%: " + data["collections"][tokenAddress]["0.35_bbc"]
            document.getElementById("0.40_bbc").innerHTML = "BB@40%: " + data["collections"][tokenAddress]["0.4_bbc"]
            document.getElementById("0.45_bbc").innerHTML = "BB@45%: " + data["collections"][tokenAddress]["0.45_bbc"]
            document.getElementById("0.50_bbc").innerHTML = "BB@50%: " + data["collections"][tokenAddress]["0.5_bbc"]
            document.getElementById("0.55_bbc").innerHTML = "BB@55%: " + data["collections"][tokenAddress]["0.55_bbc"]
            document.getElementById("0.60_bbc").innerHTML = "BB@60%: " + data["collections"][tokenAddress]["0.6_bbc"]
            document.getElementById("0.65_bbc").innerHTML = "BB@65%: " + data["collections"][tokenAddress]["0.65_bbc"]
            document.getElementById("0.70_bbc").innerHTML = "BB@70%: " + data["collections"][tokenAddress]["0.7_bbc"]
            document.getElementById("0.75_bbc").innerHTML = "BB@75%: " + data["collections"][tokenAddress]["0.75_bbc"]
            document.getElementById("0.80_bbc").innerHTML = "BB@80%: " + data["collections"][tokenAddress]["0.8_bbc"]
            document.getElementById("0.85_bbc").innerHTML = "BB@85%: " + data["collections"][tokenAddress]["0.85_bbc"]
            document.getElementById("0.90_bbc").innerHTML = "BB@90%: " + data["collections"][tokenAddress]["0.9_bbc"]
            document.getElementById("0.95_bbc").innerHTML = "BB@95%: " + data["collections"][tokenAddress]["0.95_bbc"]
            document.getElementById("1.00_bbc").innerHTML = "BB@100%: " + data["collections"][tokenAddress]["1.0_bbc"]


            // Display it
        }).catch(function(err) {
            console.log("Something errored lol but idk what it is")
            console.log("Nvm i found what it is", err)
        })

    })
}
