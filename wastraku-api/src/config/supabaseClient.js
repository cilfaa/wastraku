// ============================================================
// supabaseClient.js
// Tugas: membuat "kunci pintu" ke database Supabase.
// File lain (model) tinggal memakai `supabase` dari sini untuk
// membaca / menulis data tanpa perlu login ulang.
// ============================================================
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// dotenv membaca isi file .env (rahasia, tidak ikut ke GitHub)
dotenv.config();

// Alamat project Supabase dan kunci aksesnya, diambil dari file .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Objek `supabase` inilah yang dipakai untuk query: supabase.from("motifs")...
export const supabase = createClient(supabaseUrl, supabaseKey);
