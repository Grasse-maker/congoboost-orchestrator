import requests

url = "https://firestore.googleapis.com/v1/projects/kincommerce/databases/(default)/documents/agentcy_traffic"
data = {
    "fields": {
        "type": {"stringValue": "test_from_python"},
        "userAgent": {"stringValue": "Terminal Test"}
    }
}

print("Sending request to:", url)
response = requests.post(url, json=data)
print("Status:", response.status_code)
print("Response:", response.text)
