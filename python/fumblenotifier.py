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
    request = requests.post("https://discord.com/api/webhooks/913180688990216304/gyULOOu97vN3uPcDY-QDatysh_mvZr5ieOh2mOmTrGYHnLtMbopAfqkiYJ1Ykqzm_CaL", data=payload)
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
            "x-api-key": "4e9ca01b6f0c403d9c5110b9c89b177a",
        }
        try:
            request = requests.get(F"https://api.opensea.io/api/v1/events?collection_slug={slug}&event_type=successful&only_opensea=false&offset=0&limit=50&occurred_after={fetch_times[slug]}", headers=headers)
            print("req", slug, request.status_code)
            if len(request.json()["asset_events"]) > 0:
                for asset_event in request.json()["asset_events"]:
                    symbol = asset_event["payment_token"]["symbol"]
                    floor = get_floor(slug)
                    ratio = (float(asset_event["total_price"]) / pow(10, 18)) / float(floor)
                    print(asset_event["asset"]["asset_contract"]["name"], asset_event["asset"]["token_id"], "sold for", int(asset_event["total_price"])/pow(10,18), asset_event["payment_token"]["symbol"], F"({ratio})")
                    if symbol == "WETH" and ratio <= 1.0:
                        print("IN THIS BIH")
                        message = F'{asset_event["asset"]["asset_contract"]["name"]} {asset_event["asset"]["token_id"]} sold for {int(asset_event["total_price"])/pow(10,18)} {asset_event["payment_token"]["symbol"]} {ratio}'
                        if ratio <= 0.8:
                            message = "@everyone" + message
                        webhook(message)
            fetch_times[slug] = time.time()
            time.sleep(2)
        except:
            print("error in req/treatment")
            continue
    time.sleep(30)

print(time.time())





