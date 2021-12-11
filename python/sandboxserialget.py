from os import name
import sys
import requests


token_queries = []
numbers = []
active = ""


for index in range(200000):
    numbers.append(index)


for index in range(0, len(numbers), 30):
    chunk = numbers[index:index + 30]
    query = ""
    for number in chunk:
        query += F"&token_ids={number}"
    token_queries.append(query[1:])
    
none_count = 0

for query in token_queries:
    request = requests.get(F"https://api.opensea.io/api/v1/assets?{query}&asset_contract_address=0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a&order_direction=desc&offset=0&limit=50")
    for asset in request.json()["assets"]:
        print(asset["token_id"], asset["name"])
        if asset["name"] is None:
            none_count += 1
        elif "LAND" in asset["name"]:
            active += asset["token_id"] + " "


file = open("sandbox/tokenlist.txt", "w")
file.write(active)
file.close()
print(active, len(active), none_count)