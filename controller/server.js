const express = require("express");
app = express();
const porta = 8080;

app.use(express.json())

app.listen(porta, () =>{
    console.log("Servidor ativo na rede")
})