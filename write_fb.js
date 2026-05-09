const data = {
  fields: {
    message: { stringValue: "Test from Node" },
    status: { stringValue: "new" }
  }
};

fetch("https://firestore.googleapis.com/v1/projects/kincommerce/databases/(default)/documents/agentcy_leads?key=AIzaSyDpNESCaG7rsfEJgZGX3YksobfrBsx6r0E", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(d => console.log("Create Lead:", JSON.stringify(d)))
  .catch(err => console.error(err));

fetch("https://firestore.googleapis.com/v1/projects/kincommerce/databases/(default)/documents/agentcy_leads?key=AIzaSyDpNESCaG7rsfEJgZGX3YksobfrBsx6r0E")
  .then(res => res.json())
  .then(d => console.log("Read Leads:", JSON.stringify(d).substring(0, 100)))
  .catch(err => console.error(err));
