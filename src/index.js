const { request, response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json())

const customers = [];

app.get("/", (request, response) => {
  
  response.json(customers);
})

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

 const customer = customers.find(customer => customer.cpf === cpf);

 if(!customer) {
   return response.status(401).json({ error: "Customer not found"});
 }

 request.customer = customer;

 return next();
}

app.post("/account", (request, response) => {
  const { name, cpf } = request.body;

  const cpfAlreadyExist = customers.some(customer => customer.cpf === cpf);

  if(cpfAlreadyExist) {
    return response.status(400).json({error: "Already exists"});
  }

  customers.push({
    name,
    cpf,
    id: uuidv4(),
    statement: []
  }); 

  return response.status(200).json();
})

app.listen(3333);