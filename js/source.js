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
var proxyIndex = 0 // For dynamic
var apiKeys = [
    "2f6f419a083c46de9d83ce3dbe7db601",
    "091fd4ebc71b4ae198a3bf86167b6fa2",
    "4e9ca01b6f0c403d9c5110b9c89b177a",
    "7c94683799a34c61b89051a5e58ad676",
    "5cda77bcc2e64a679a1dd5ba1d38d9e2"
]


// ADD DOUBLE CLICK TO GO TWICE AS FAST WITH ARRAY TO NOT DO THEM TWICE
// NOTIFY WHEN MARGIN GETS CLAPPED
// AUTOMATION


//window.ethereum.enable()


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function getSerials(tokenAddress) {
    let targetSerials = document.getElementById("serials").value.split(" ")
    
    if (document.getElementById("serials").value == "decentramode" || document.getElementById("serials").value == "decentradynamic") {
        targetSerials = decentraSerials
    } else if (document.getElementById("serials").value == "sandymode" || document.getElementById("serials").value == "sandydynamic") {
        targetSerials = sandySerials
    }

    if (document.getElementById("listingsonly").checked) {
        let tokenIdPayloads = []

        for (let i = 0; i < targetSerials.length; i = i+30) {
            let sub = []
            for (let idx = 0; idx < 30; idx++) {
                sub.push(i + idx)
            }
            tokenIdPayloads.push(sub)
        } // TEST PAYLOADS 

        let listings = []
        let proxyIndex = 0
        for (let i = 0; i < tokenIdPayloads.length; i++) {
            proxyIndex ++ 
            if (proxyIndex > 3) {
                proxyIndex = 0
            }
            
            let tidString = "&"
            for (let idx = 0; idx < tokenIdPayloads[i].length; idx++) {
                tidString += `token_ids=${tokenIdPayloads[i][idx]}&`
            }
    
            const response = await fetch(`https://sandyproxy-${proxyIndex + 1}.fruitbarrel.repl.co/proxy?url=~https://api.opensea.io/wyvern/v1/orders?asset_contract_address=${tokenAddress}&is_english=false&bundled=false&include_bundled=false&include_invalid=false${tidString}&side=1&limit=50&offset=0&order_by=created_date&order_direction=desc~`)
            const data = await response.json()

            orders = data["orders"]
            for (let idx = 0; idx < orders.length; idx++) {
                if (!(listings.includes(orders[idx]["asset"]["token_id"]))) {
                    listings.push(orders[idx]["asset"]["token_id"])
                    console.log("Listing", listings.length, "added", orders[idx]["asset"]["token_id"], listings)
                }
            }

            console.log("LISTING COUNT:", listings.length, "STATUS:", response.status, data["orders"])
        }
        targetSerials = listings
    }

    return targetSerials
}


async function main() {
    console.log("STARTED")
    const tokenAddress = document.getElementById("colltoken").value
    const hours = parseFloat(document.getElementById("expiry").value)
    var sleepValue = parseFloat(document.getElementById("sleep").value)
    let startIndex = parseInt(document.getElementById("startindex").value)
    let offerAmount = parseFloat(document.getElementById("offeramount").value)
    let maxBid = parseFloat(document.getElementById("maxbid").value)
    let reqLatency = 0

    let targetSerials = await getSerials(tokenAddress)

    const provider = new HDWalletProvider({
        privateKeys: [document.getElementById("pkey").value],
        providerOrUrl: alchemy
    });

    const seaport = new OpenSeaPort(provider, {
        networkName: Network.Main,
        apiKey: document.getElementById("apikey").value
    })

    for (let i = startIndex; i < targetSerials.length; i++) {
        if (document.getElementById("serials").value == "sandydynamic" || document.getElementById("serials").value == "decentradynamic") {
            try {
                stime = Date.now()
                proxyIndex ++ 
                if (proxyIndex > 3) {
                    proxyIndex = 0
                }
                const response = await fetch(`https://sandyproxy-${proxyIndex}.fruitbarrel.repl.co/proxy?url=~https://api.opensea.io/wyvern/v1/orders?asset_contract_address=${tokenAddress}&bundled=false&include_bundled=false&include_invalid=false&token_ids=${targetSerials[i]}&side=0&limit=50&offset=0&order_by=eth_price&order_direction=desc`)
                const data = await response.json()
                ftime = Date.now()
                reqLatency = ftime-stime
                let bespokeOfferAmount = 0
                let highestOfferForSerial = null
                if ("orders" in data) {
                    if (data["orders"].length > 0) {
                        highestOfferForSerial = parseFloat(data["orders"][0]["current_price"]) / Math.pow(10, 18)
                    }
                }
                console.log("highest offer for serial", targetSerials[i], highestOfferForSerial)
                if (highestOfferForSerial) {
                    if (maxBid >= (highestOfferForSerial + 0.003).toFixed(12)) {
                        bespokeOfferAmount = (highestOfferForSerial + 0.003).toFixed(12)
                    } else if (maxBid <= (highestOfferForSerial + 0.003).toFixed(12)) {
                        bespokeOfferAmount = maxBid
                    }
                } else {
                    bespokeOfferAmount = offerAmount
                }

                dynamicOffers.push(bespokeOfferAmount)
                console.log("Dynamic Offer", bespokeOfferAmount)//, dynamicOffers.sort(function(a,b) { return a - b}))

                
                const offer = await seaport.createBuyOrder({
                    asset: {
                        tokenAddress: tokenAddress, // CryptoKitties
                        tokenId: targetSerials[i], // Token ID
                    },
                    accountAddress,
                    // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
                    startAmount: bespokeOfferAmount,
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
        console.log("sleeping...")
        await sleep(sleepValue - reqLatency)
        console.log("slept", sleepValue - reqLatency, "ms")
    } 
    console.log("run done")
}

window.onload = function(){
    document.getElementById("enter").addEventListener("click", function(){
        console.log(MD5(document.getElementById("password").value).toString())
        console.log("a66f0b0740385279d65d2c43a8dc06a9")
        console.log("08d73df56eabed0bb5dec9346fd8570b")

        if (MD5(document.getElementById("password").value).toString() == "bf44b053a6003d7283b45d4c96c1360d") { // 100Gwei
            accountAddress = "0x47ebeEda2ACB61510B9479970F16701651fff985"
            alchemy = "https://eth-mainnet.alchemyapi.io/v2/98FU1uo1p9pfp6KV2iS8GEi3Ny4JD5zR"
            main()
        } else if (MD5(document.getElementById("password").value).toString() == "e16744251267fe262c5650eb596c58ab") { // 200Gwei
            accountAddress = "0x2186b4B668492aC05f76ecC34aD9C01A5E456815"
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
        console.log("Clicked Decentramode")
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
        console.log("Clicked Sandymode")
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
