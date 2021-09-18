const opensea = require("opensea-js")
const OpenSeaPort = opensea.OpenSeaPort
const Network = opensea.Network
const Web3 = require("web3")


const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')


const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main
})

const accountAddress = "0x59a5f50c788579d73dbd8d4e56a5a262783ddccf"

const asset = {
    tokenAddress: "0x60e4d786628fea6478f785a6d7e704777c86a7c6", // CryptoKitties
    tokenId: "1830", // Token ID
}

async function main() {
    const balance = await seaport.getAssetBalance({
        accountAddress, // string
        asset, // Asset
    })
    console.log(balance.greaterThan(0))
}

console.log(window.ethereum.enable())