// Configurazione API URL basata sull'ambiente
const isDevelopment = process.env.NODE_ENV === 'development';

// In produzione, l'API URL sarà quello del tuo backend deployato su Render
export const API_URL = isDevelopment 
  ? 'http://127.0.0.1:10000'
  : 'https://edilpro-backend.onrender.com'; // URL del backend su Render

// Headers per le richieste API
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'bypass-tunnel-reminder': 'true' // Bypass per LocalTunnel
}; 