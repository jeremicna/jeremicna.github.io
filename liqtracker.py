import requests
import time


token_id_payloads = []
count = 10000
order_count = 0
alr_hit = []


for index in range(0, count, 30):
    sub = []
    for idx in range(30):
        sub.append(index + idx)
    token_id_payloads.append(sub)


for payload in token_id_payloads:
    url = "https://api.opensea.io/wyvern/v1/orders"
    querystring = {"asset_contract_address":"0x1a92f7381b9f03921564a437210bb9396471050c","is_english":"false","bundled":"false","include_bundled":"false","include_invalid":"false","token_ids":payload,"side":"1","limit":"50","offset":"0","order_by":"created_date","order_direction":"desc"}
    headers = {"Accept": "application/json"}
    request = requests.request("GET", url, headers=headers, params=querystring)
    for order in request.json()["orders"]:
        if order["asset"]["token_id"] not in alr_hit:
            alr_hit.append(order["asset"]["token_id"])
            order_count += 1

    print(order_count, request.status_code, payload)
    time.sleep(0.6)


file = open("output.txt", "w")
file.write(" ".join(alr_hit))
file.close()