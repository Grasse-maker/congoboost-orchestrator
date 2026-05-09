fetch("https://firestore.googleapis.com/v1/projects/kincommerce/databases/(default)/documents/agentcy_leads")
  .then(res => res.json())
  .then(data => console.log("Leads:", JSON.stringify(data).substring(0, 500)))
  .catch(err => console.error(err));

fetch("https://firestore.googleapis.com/v1/projects/kincommerce/databases/(default)/documents/agentcy_traffic")
  .then(res => res.json())
  .then(data => console.log("Traffic:", JSON.stringify(data).substring(0, 500)))
  .catch(err => console.error(err));
