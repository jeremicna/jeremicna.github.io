import sys
import requests
import json


data = {
    "id": 0,
    "jsonrpc":"2.0",
    "method":"eth_getLogs",
    "params":[
        {
            "fromBlock": hex(12889267),
            "toBlock":   hex(12889267),
            "address": "0x26a1bdfa3bb86b2744c4a42ebfdd205761d13a8a"
        }
    ]
}
hashes = []
provider = "https://bsc-dataseed.binance.org"


request = requests.post(provider, data=json.dumps(data))
print(request.json())


for result in request.json()["result"]:
    hashes.append(result["transactionHash"])

    data = {
        "id": 0,
        "jsonrpc":"2.0",
        "method":"eth_getTransactionByHash",
        "params":[
            ""
        ]
    }
    request = requests.post(provider, data=json.dumps(data))
    print(request.json())s







"""
provider finna be bsc rpc json api
use web3py or js (fuck js)
get transactions by block for a token
get transaction info
speed in mind always, block by block

maybe run own node eventually
"""



