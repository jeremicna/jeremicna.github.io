from requests.models import PreparedRequest
from flask import Flask, jsonify
from threading import Thread
import threading
import requests
import time
import math
import copy


ctokenstr = input("Input Collection Tokens (SSV):")
ctokens = ctokenstr.split(" ")
listing_prices = {"collections":{}} # Format: Collection Token > Serial:Price {"collections":{"0x...": {"123": 1.3}}}
collection_data = {"collections":{}}
display = {}
proxies = [
    "https://1-1.fruitbarrel.repl.co", 
    "https://2-1.fruitbarrel.repl.co", 
    "https://3-1.fruitbarrel.repl.co",
    "https://4-1.fruitbarrel.repl.co",
    "https://5-1.fruitbarrel.repl.co",
    "https://6-1.fruitbarrel.repl.co",
    "https://7-1.fruitbarrel.repl.co",
    "https://8-1.fruitbarrel.repl.co",
    "https://9-1.fruitbarrel.repl.co",
    "https://10-1.fruitbarrel.repl.co",
    "https://11-1.fruitbarrel.repl.co",
    "https://12-1.fruitbarrel.repl.co",
    "https://13-1.fruitbarrel.repl.co",
    "https://14-1.fruitbarrel.repl.co",
    "https://15-1.fruitbarrel.repl.co",
    "https://16-1.fruitbarrel.repl.co",
    "https://17-1.fruitbarrel.repl.co",
    "https://18-1.fruitbarrel.repl.co",
    "https://19-1.fruitbarrel.repl.co",
    "https://20-1.fruitbarrel.repl.co"
]
payload_index = -1
proxy_index = 0
reqs_active = 0
done = True


def get_count(ctoken):
    request = requests.get(F"https://api.opensea.io/api/v1/assets?asset_contract_address={ctoken}&order_direction=desc")
    highest_serial = request.json()["assets"][0]["token_id"]
    
    return highest_serial

    
def get_payloads(ctoken):
    payloads = []
    count = int(get_count(ctoken))

    for index in range(0, count, 10):
        sub = []
        for idx in range(10):
            sub.append(index + idx)
        payloads.append(sub)

    return payloads


def get_listed_serials_thread(ctoken, payloads):
    global done
    global reqs_active
    global payload_index
    global proxy_index

    listing_prices["collections"][ctoken] = []
    collection_name = ""
    collection_desc = ""
    detected = []
    
    while payload_index < len(payloads):
        print(payloads[payload_index])

        url = "https://api.opensea.io/wyvern/v1/orders"
        params = {"asset_contract_address":ctoken,"is_english":"false","bundled":"false","include_bundled":"false","include_invalid":"false","token_ids":payloads[payload_index],"side":"1","limit":"50","offset":"0","order_by":"created_date","order_direction":"desc"}
        req = PreparedRequest()
        req.prepare_url(url, params)

        proxy_index += 1
        if proxy_index > len(proxies) - 1:
            proxy_index = 0

        print(proxy_index)
        payload_index += 1

        reqs_active += 1
        request = requests.get(F"{proxies[proxy_index]}/proxy?url=~{req.url}~")
        reqs_active -= 1

        print("ReqDone")

        for order in request.json()["orders"]:
            collection_name = order["asset"]["asset_contract"]["name"]
            collection_desc = order["asset"]["asset_contract"]["description"]
            if order["asset"]["token_id"] not in detected:
                detected.append(order["asset"]["token_id"])
                if order["payment_token_contract"]["id"] == 1:
                    collection_data["collections"][ctoken]["listed_serials"][order["asset"]["token_id"]] = float(order["current_price"]) / pow(10, 18)
                    listing_prices["collections"][ctoken].append(float(order["current_price"]) / pow(10, 18))

    collection_data["collections"][ctoken]["collection_name"] = collection_name
    collection_data["collections"][ctoken]["collection_desc"] = collection_desc
    # collection_data["collections"][ctoken]["listed_serials"] += detected
    
    if reqs_active <= 0:
        done = True
        print("done")



def get_listed_serials(ctoken, payloads):
    global done
    done = False

    for index in range(math.floor(len(proxies)/2.5)):
        print(index, )
        thread = threading.Thread(target=get_listed_serials_thread, args=(ctoken, payloads))
        thread.start()
        time.sleep(0.5)

    while not done:
        time.sleep(1)



def get_highest_bids_thread(ctoken, basic_payloads):
    global done
    global reqs_active
    global payload_index
    global proxy_index

    serials = []
    payloads = []

    print(len(collection_data["collections"][ctoken]["listed_serials"]), "serials")

    for key, value in collection_data["collections"][ctoken]["listed_serials"].items():
        serials.append(key)

    for basic_payload in basic_payloads:
        payload = []
        for index in basic_payload:
            if index < len(collection_data["collections"][ctoken]["listed_serials"]):
                payload.append(serials[index])
            else:
                break
        if len(payload) > 0:
            payloads.append(payload)

    print(len(payloads))

    while payload_index < len(payloads):
        print(payloads[payload_index])

        url = "https://api.opensea.io/wyvern/v1/orders"
        params = {"asset_contract_address":ctoken,"is_english":"false","bundled":"false","include_bundled":"false","include_invalid":"false","token_ids":payloads[payload_index],"side":"0","limit":"50","offset":"0","order_by":"eth_price","order_direction":"desc"}
        req = PreparedRequest()
        req.prepare_url(url, params)

        proxy_index += 1
        if proxy_index > len(proxies) - 1:
            proxy_index = 0

        print(proxy_index)
        payload_index += 1

        reqs_active += 1
        request = requests.get(F"{proxies[proxy_index]}/proxy?url=~{req.url}~")
        reqs_active -= 1
        print("reqDone")

        for order in request.json()["orders"]:
            if order["asset"]["token_id"] not in collection_data["collections"][ctoken]["bids"]:
                collection_data["collections"][ctoken]["bids"][order["asset"]["token_id"]] = int(order["base_price"]) / pow(10, 18)

    if reqs_active <= 0:
        done = True
        print("done")

    print(collection_data)
    print(len(collection_data["collections"][ctoken]["listed_serials"]), "listings")
    print(len(collection_data["collections"][ctoken]["bids"]), "bids")
        

def get_highest_bids(ctoken, basic_payloads):
    global done
    done = False

    for index in range(math.floor(len(proxies)/2.5)):
        print(index, )
        thread = threading.Thread(target=get_highest_bids_thread, args=(ctoken, basic_payloads))
        thread.start()
        time.sleep(0.5)

    while not done:
        time.sleep(1)


def add_stats(ctoken):
    global display
    floor_price = 0

    for key, value in collection_data["collections"][ctoken]["listed_serials"].items():
        if value < floor_price or floor_price == 0:
            floor_price = value


    collection_data["collections"][ctoken]["floor_price"] = floor_price
    collection_data["collections"][ctoken]["listing_count"] = len(collection_data["collections"][ctoken]["listed_serials"])
    collection_data["collections"][ctoken]["bid_count"] = len(collection_data["collections"][ctoken]["bids"])


    ratios = [0.05, 0.1, 0.15, 0.20, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]
    for ratio in ratios:
        theoretical_bid = floor_price * ratio
        beat_bids_count = 0
        for key, value in collection_data["collections"][ctoken]["bids"].items():
            if theoretical_bid > value:
                print(theoretical_bid)
                print(value)
                beat_bids_count += 1
        collection_data["collections"][ctoken][str(ratio)+"_bbc"] = beat_bids_count
        print("Bid", ratio*100, "% Of floor to beat", beat_bids_count/len(collection_data["collections"][ctoken]["bids"].items())*100, "% Of bids")

    collection_data["collections"][ctoken]["updated_at"] = time.time()
    display = copy.deepcopy(collection_data)
    print(collection_data)


app = Flask('')


@app.route('/')
def main():
    global display
    response = jsonify(display)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def run():
    app.run(host="0.0.0.0", port=8080)

def keep_alive():
    server = Thread(target=run)
    server.start()


keep_alive()


while True:
    for c in ctokens:
        collection_data["collections"][c] = {}
        collection_data["collections"][c]["listed_serials"] = {}
        collection_data["collections"][c]["bids"] = {}

        payloads = get_payloads(c)

        payload_index = -1
        get_listed_serials(c, payloads)
        print(collection_data)

        payload_index = -1
        get_highest_bids(c, payloads)
        add_stats(c)


