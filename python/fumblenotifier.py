import requests
import json
import time

from requests.api import head


collections = {}
fetch_times = {}


def webhook(message):
    payload = {
        "content": message
    }
    request = requests.post("https://discord.com/api/webhooks/827597233884495922/iEb7bujQyCymwznUoTfNz4VwjL05Q30raSIGZ20w00_qwWvOPztNa9GWLihNmYddijem", data=payload)
    print("post", request.status_code)


def get_top():
    slugs = []
    file = open("python/ranking_html.html", "r", encoding="utf8")
    data = file.read()
    file.close()
    json_data = json.loads(data.split("\"json\":")[1].split(",\"data\":")[0])
    for node in json_data["data"]["rankings"]["edges"]:
        slugs.append(node["node"]["slug"])
    return slugs


def get_tokens(slugs):
    for slug in slugs:
        request = requests.get(F"https://api.opensea.io/api/v1/collection/{slug}")
        if len(request.json()["collection"]["primary_asset_contracts"]) > 0:
            print(slug)
            ctoken = request.json()["collection"]["primary_asset_contracts"][0]["address"]
            collections[ctoken] = slug


def get_floor(slug):
    request = requests.get(F"https://api.opensea.io/api/v1/collection/{slug}/stats")
    floor_price = request.json()["stats"]["floor_price"]
    return floor_price


slugs = get_top()
# get_tokens(slugs)


while True:
    print("NEW ITERATION")
    for slug in slugs:
        if slug not in fetch_times.keys():
            fetch_times[slug] = time.time()
            continue
        headers = {
            #"content-type": "application/json",
            "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
        }
        request = requests.get(F"https://api.opensea.io/api/v1/events?collection_slug={slug}&event_type=successful&only_opensea=false&offset=0&limit=50&occurred_after={fetch_times[slug]}", headers=headers)
        print("req", slug, request.status_code, request.text)
        if len(request.json()["asset_events"]) > 0:
            for asset_event in request.json()["asset_events"]:
                symbol = asset_event["payment_token"]["symbol"]
                floor = get_floor(slug)
                ratio = (float(asset_event["total_price"]) / pow(10, 18)) / float(floor)
                if symbol == "WETH" and ratio <= 1:
                    message = asset_event["asset"]["asset_contract"]["name"], asset_event["asset"]["token_id"], "sold for", int(asset_event["total_price"])/pow(10,18), asset_event["payment_token"]["symbol"], F"({ratio})"
                    webhook(message)
                print(asset_event["asset"]["asset_contract"]["name"], asset_event["asset"]["token_id"], "sold for", int(asset_event["total_price"])/pow(10,18), asset_event["payment_token"]["symbol"], F"({ratio})")
        fetch_times[slug] = time.time()
        time.sleep(1)
    time.sleep(3)

print(time.time())





