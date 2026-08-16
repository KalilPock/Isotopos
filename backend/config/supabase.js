require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Declaração global das chaves e do cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

module.exports = supabase;