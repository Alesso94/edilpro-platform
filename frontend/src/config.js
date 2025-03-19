// Configurazione API URL basata sull'ambiente
const isDevelopment = process.env.NODE_ENV === 'development';

// In produzione, l'API URL sarà quello del tuo backend deployato
// Per ora usiamo un placeholder che dovrai sostituire con l'URL reale del tuo backend
export const API_URL = isDevelopment 
  ? 'http://localhost:3002'
  : 'https://tua-api.herokuapp.com'; // Questo è solo un esempio, dovrai sostituirlo con il tuo URL reale 