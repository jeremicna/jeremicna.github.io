import requests


headers = {
    "content-type": "application/json",
    "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
    "x-signed-query": "1407bdc43ea7c4879aa0218284bea8f2ec9d1db24e0369e2da746f5dc1c1098d",
    "x-viewer-address": "0x49484ca89a87778798edf6fdbc74166170b25ec7",
    "x-build-id": "lUCU11hWQRD9vkXKcdtPr",
    "origin": "https://opensea.io/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
}


data = {"id":"NavbarQuery","query":"query NavbarQuery {\n  account {\n    imageUrl\n    user {\n      publicUsername\n      isStaff\n      id\n    }\n    id\n  }\n}\n","variables":{}}


request = requests.post("https://api.opensea.io/graphql/", headers=headers, data=data)
print(request)
print(request.text)