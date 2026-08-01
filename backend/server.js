require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

//config supabase
const supaBaseURL = process.env.SUPABASE_URL;
const supabaseKEY = process.env.SUPABASE_KEY;
const supabse = createClient(supaBaseURL,supabaseKEY);

//config de teste
app.get('/api/status',(req,res)=>{
    res.json({
        status:'online',
        mensagem:"Servidor ativo na rede"
    })
})

//rota form login
app.post('/api/login',  async (req,res)=>{

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
  console.log(`\n--- SISTEMA ISÓTOPOS ---`);
  console.log(`[Backend] Rodando na porta: ${PORT}`);
  
  if (supabaseUrl && supabaseKey) {
    console.log(`[Database] Supabase inicializado com sucesso!`);
  } else {
    console.log(`[Database] ERRO: Chaves não encontradas.`);
  }
})