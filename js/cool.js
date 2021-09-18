const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")


const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/59938e653dd147b08f830faa2deda492')


const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main
})

const accountAddress = "0xC2d714611B8d490aB21AF2E35cEdeAB10bb53fDd"

const asset = {
    tokenAddress: "0x60e4d786628fea6478f785a6d7e704777c86a7c6", // CryptoKitties
    tokenId: "1830", // Token ID
}

async function main() {
    const offer = await seaport.createBuyOrder({
        asset: {
            tokenAddress: "0x60e4d786628fea6478f785a6d7e704777c86a7c6", // CryptoKitties
            tokenId: "1830", // Token ID
        },
        accountAddress,
        // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
        startAmount: 1.2,
    })
    console.log(offer)
}

window.onload = function(){
    document.getElementById("enter").addEventListener("click", function(){
        main()
    })
}

console.log(window.ethereum.enable())