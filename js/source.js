const HDWalletProvider = require("@truffle/hdwallet-provider");
const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")
const MD5 = require("crypto-js/md5");
const { stringify } = require("querystring");
var accountAddress = ""
var alchemy = ""
var active = true
var decentraSerials = []
var sandySerials = []
var dynamicOffers = []


// ADD DOUBLE CLICK TO GO TWICE AS FAST WITH ARRAY TO NOT DO THEM TWICE
// NOTIFY WHEN MARGIN GETS CLAPPED
// AUTOMATION


//window.ethereum.enable()


async function main() {
    console.log("STARTED")
    let targetSerials = document.getElementById("serials").value.split(" ")
    if (document.getElementById("serials").value == "decentramode") {
        targetSerials = decentraSerials
    } else if (document.getElementById("serials").value == "sandymode") {
        targetSerials = sandySerials
    }
    console.log(targetSerials.length)
    const tokenAddress = document.getElementById("colltoken").value
    const hours = parseInt(document.getElementById("expiry").value)
    let offerAmount = parseFloat(document.getElementById("offeramount").value)

    const provider = new HDWalletProvider({
        privateKeys: [document.getElementById("pkey").value],
        providerOrUrl: alchemy
    });
    
    const seaport = new OpenSeaPort(provider, {
        networkName: Network.Main,
        apiKey: "2f6f419a083c46de9d83ce3dbe7db601"
    })
    for (let i = 0; i < targetSerials.length; i++) {
        if (document.getElementById("serials").value == "sandymode - just so condition fails") {
            try {
                const response = await fetch(`https://sandyproxy.fruitbarrel.repl.co/proxy?url=~https://api.opensea.io/wyvern/v1/orders?asset_contract_address=${tokenAddress}&bundled=false&include_bundled=false&include_invalid=false&token_ids=${targetSerials[i]}&side=0&limit=50&offset=0&order_by=eth_price&order_direction=desc`)
                const data = await response.json()
                let bespokeOfferAmount = 0
                let highestOfferForSerial = parseFloat(data["orders"][0]["current_price"]) / Math.pow(10, 18)
                console.log("highest offer for serial", targetSerials[i], highestOfferForSerial)
                if (offerAmount > highestOfferForSerial) {
                    bespokeOfferAmount = highestOfferForSerial += 0.003
                }
                dynamicOffers.push(bespokeOfferAmount)
                console.log("Dynamic Offer", bespokeOfferAmount)//, dynamicOffers.sort(function(a,b) { return a - b}))

                
                const offer = await seaport.createBuyOrder({
                    asset: {
                        tokenAddress: tokenAddress, // CryptoKitties
                        tokenId: targetSerials[0], // Token ID
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
        } else {
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
    } 
    console.log("run done")
}

window.onload = function(){
    document.getElementById("enter").addEventListener("click", function(){
        console.log(MD5(document.getElementById("password").value).toString())
        console.log("a66f0b0740385279d65d2c43a8dc06a9")
        console.log("08d73df56eabed0bb5dec9346fd8570b")

        if (MD5(document.getElementById("password").value).toString() == "a66f0b0740385279d65d2c43a8dc06a9") { // olivemain
            accountAddress = "0x167d487990cf93813370aea88db435a5d3902fe2"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/98FU1uo1p9pfp6KV2iS8GEi3Ny4JD5zR"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "08d73df56eabed0bb5dec9346fd8570b") { // ludovic
            accountAddress = "0xc5fdeF0fF84be777E045d2cB05359d3Fc66f9023"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/uWdYeNPjRbGTEzefSyCw6ay4qAS5OOJf"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "ee5bf3c471288eda453ff4dd65ccd10a") { // mine
            accountAddress = "0xC2d714611B8d490aB21AF2E35cEdeAB10bb53fDd"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/2KR0nf7o5hWW2-n_i1SgnprxaLebcMjM"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "66270b4fb4e2273f846361c1ca6b0864") { // mine1
            accountAddress = "0x49484Ca89a87778798EDf6fDbC74166170b25ec7"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/2KR0nf7o5hWW2-n_i1SgnprxaLebcMjM"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "2a8d495332634769d85c5ce60b8e6ee4") { // mine2
            accountAddress = "0x16de22f2EFA0ECb80CBE0e6fB304d13FF5C8793e"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/2KR0nf7o5hWW2-n_i1SgnprxaLebcMjM"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "b211ee8c8dda2c9c864d08028605553c") { // sensational
            accountAddress = "0x2d98E1daF60F778AB57dc7A12cF98919DdA17540"
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

            if (document.getElementById("floor_override").value != "") {
                console.log("FloorOverriden")
                floorPrice = parseFloat(document.getElementById("floor_override").value)
            }

            document.getElementById("serials").value = listedSerialString
            document.getElementById("collection_name").innerHTML = collectionName
            //document.getElementById("collection_description").innerHTML = collectionDescription
            document.getElementById("token_address").innerHTML = tokenAddress
            document.getElementById("floor_price").innerHTML = "Floor Price: " + floorPrice
            document.getElementById("listing_count").innerHTML = "Listing Count: " + listingCount
            document.getElementById("bid_count").innerHTML = "Bid Count: " + bidCount
            document.getElementById("updated_at").innerHTML = "Updated At: " + updatedAt

            let ratios = [0.05, 0.1, 0.15, 0.20, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]
            for (let index in ratios) {
                console.log(ratios[index])
                let theoreticalBid = (floorPrice * ratios[index]).toFixed(4)
                let beatBidsCount = 0
                for (let key in data["collections"][tokenAddress]["bids"]) {
                    if (theoreticalBid > data["collections"][tokenAddress]["bids"][key]) {
                        beatBidsCount ++
                    }
                }

                document.getElementById(ratios[index]).innerHTML = `BB@${(ratios[index] * 100).toFixed(0)} (${theoreticalBid}): ${beatBidsCount}`
                /*
                const label = document.createElement("label")
                const node = document.createTextNode(`BB@${(ratios[index] * 100).toFixed(0)} (${theoreticalBid}): ${beatBidsCount}`)
                label.appendChild(node)
                label.setAttribute("id", ratios[index])
                const sr = document.getElementById("split right")
                sr.appendChild(label)
                sr.appendChild(br)
                */
            }

            // Display it
        }).catch(function(err) {
            console.log("Something errored lol but idk what it is")
            console.log("Nvm i found what it is", err)
        })

    })
    document.getElementById("decentramode").addEventListener("click", function(){
        fetch("https://decentraserials.fruitbarrel.repl.co").then(function(response){
            return response.json()
        }).then(function(data){
            console.log(data)
            decentraSerials = data
            document.getElementById("colltoken").value = "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d"
            document.getElementById("serials").value = "decentramode"
        }).catch(function(err){
            console.log("Something errored lol but idk what it is")
            console.log("Nvm i found what it is", err)
        })
    })
    document.getElementById("sandymode").addEventListener("click", function(){
        fetch("https://sandboxserials.fruitbarrel.repl.co").then(function(response){
            return response.json()
        }).then(function(data){
            console.log(data)
            sandySerials = data
            document.getElementById("colltoken").value = "0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a"
            document.getElementById("serials").value = "sandymode"
        }).catch(function(err){
            console.log("Something errored lol but idk what it is")
            console.log("Nvm i found what it is", err)
        })
    })
}
