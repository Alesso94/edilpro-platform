const axios = require('axios');

const API_URL = 'https://edilpro-backend.onrender.com/api';

const testAPI = async () => {
    try {
        // Test 1: Verifica se il server è attivo
        console.log('Test 1: Verifica server attivo');
        const response = await axios.get(API_URL);
        console.log('Response:', response.data);

        // Test 2: Login con utente esistente
        console.log('\nTest 2: Login');
        const loginData = {
            email: 'test7@example.com',
            password: 'test123'
        };
        
        const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
        console.log('Login Response:', loginResponse.data);

        // Test 3: Creazione nuovo progetto
        console.log('\nTest 3: Creazione nuovo progetto');
        const token = loginResponse.data.token;
        const projectData = {
            title: 'Villa Moderna',
            description: 'Progetto di ristrutturazione villa unifamiliare',
            startDate: '2024-04-01',
            endDate: '2024-08-31',
            budget: 350000,
            status: 'In Corso',
            category: 'Ristrutturazione',
            owner: loginResponse.data.user._id,
            tasks: [
                { name: 'Rilievo stato di fatto', completed: false },
                { name: 'Progetto preliminare', completed: false },
                { name: 'Pratiche comunali', completed: false }
            ]
        };

        const createProjectResponse = await axios.post(`${API_URL}/projects`, projectData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Create Project Response:', createProjectResponse.data);

        // Test 4: Recupero progetti
        console.log('\nTest 4: Recupero progetti');
        const projectsResponse = await axios.get(`${API_URL}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Projects List Response:', projectsResponse.data);

        console.log('\nTutti i test completati con successo! ✓');
    } catch (error) {
        console.error('\nErrore durante i test:', error.response ? {
            status: error.response.status,
            headers: error.response.headers,
            data: error.response.data
        } : error.message);
    }
};

testAPI(); 