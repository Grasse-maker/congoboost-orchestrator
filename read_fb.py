import requests

url = "https://firestore.googleapis.com/v1/projects/kincommerce/databases/(default)/documents/agentcy_leads"
response = requests.get(url)
print("Status:", response.status_code)
print("Response:", response.text[:1000]) # Print first 1000 chars

url_traffic = "https://firestore.googleapis.com/v1/projects/kincommerce/databases/(default)/documents/agentcy_traffic"
resp2 = requests.get(url_traffic)
print("Traffic Status:", resp2.status_code)
print("Traffic Response:", resp2.text[:1000])
