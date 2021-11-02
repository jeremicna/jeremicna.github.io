import requests 
import time


ids = ""


request = requests.get("https://api.decentraland.org/v2/tiles")
for key, value in request.json()["data"].items():
    print(F"({key}) ->", value["tokenId"])
    ids = ids + value["tokenId"] + " "


file = open("output.txt", "w")
file.write(ids)
file.close()


print("Length of IDS: ", len(ids))

