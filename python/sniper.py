import sys
import requests
import json



methods = {
    "add_liquidity_eth": "0xf305d719",
    "swap_exact_eth_for_tokens": "0x7ff36ab5"
}
provider = "https://bsc-dataseed.binance.org"
token = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"


def get_current_block():
    data = {
        "id": 0,
        "jsonrpc":"2.0",
        "method":"eth_blockNumber",
        "params":[]
    }
    request = requests.post(provider, data=json.dumps(data))
    print(request.json())
    return request.json()["result"]


def get_block_hashes(block):
    hashes = []

    data = {
        "id": 0,
        "jsonrpc":"2.0",
        "method":"eth_getLogs",
        "params":[
            {
                "fromBlock": block,
                "toBlock":   block,
                "address": token
            }
        ]
    }

    request = requests.post(provider, data=json.dumps(data))
    for result in request.json()["result"]:
        hashes.append(result["transactionHash"])

    print("Fetched", len(hashes), "hashes for block", int(block, 16))
    return hashes


def scan_transactions(hashes):
    for hash in hashes:
        data = {
            "id": 0,
            "jsonrpc":"2.0",
            "method":"eth_getTransactionByHash",
            "params":[
                hash
            ]
        }
        request = requests.post(provider, data=json.dumps(data))
        print(request.json()["result"]["input"][:10], request.json()["result"]["hash"])
        if methods["add_liquidity_eth"] in request.json()["result"]["input"]:
            print("Liquidity added:", request.json()["result"]["hash"])
            sys.exit()


while True:
    block = get_current_block()
    hashes = get_block_hashes(block)
    scan_transactions(hashes)








"""
provider finna be bsc rpc json api
use web3py or js (fuck js)
get transactions by block for a token
get transaction info
speed in mind always, block by block

maybe run own node eventually
"""



