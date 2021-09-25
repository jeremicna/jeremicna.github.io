import requests

url = "https://api.opensea.io/wyvern/v1/orders"

querystring = {"bundled":"false","include_bundled":"false","include_invalid":"false","limit":"20","offset":"0","order_by":"created_date","order_direction":"desc"}

headers = {"Accept": "application/json"}

response = requests.request("GET", url, headers=headers, params=querystring)

print(response.text)