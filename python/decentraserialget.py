import requests 
import time


ids = ""
ids_list = []


request = requests.get("https://api.decentraland.org/v2/tiles")
for key, value in request.json()["data"].items():
    if value["type"] == "owned":
        ids_list.append(value["tokenId"])
        ids = ids + value["tokenId"] + " "
        print(F"({key}) ->", value["tokenId"], value["type"])


file = open("decentra/tokenlist-no-roads-districts.txt", "w")
file.write(ids)
file.close()


print("Lengths of IDS: ", len(ids_list), len(ids))

