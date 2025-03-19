const axios = require('axios');

const API_URL = 'http://127.0.0.1:10000/api';

async function testAPIs() {
    try {
        console.log('Starting API tests...\n');

        // Test 1: Verifica che il server sia attivo
        console.log('Test 1: Verifica server attivo');
        const baseResponse = await axios.get(`${API_URL}`);
        console.log('Status:', baseResponse.status);
        console.log('Response:', baseResponse.data);
        console.log('✓ Server is running\n');

        // Test 2: Registrazione nuovo utente
        console.log('Test 2: Registrazione utente');
        const registerData = {
            email: 'test6@example.com',
            password: 'test123',
            name: 'Test User 6',
            profession: 'Architetto',
            license: 'ABC123'
        };
        const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
        console.log('Status:', registerResponse.status);
        console.log('Response:', registerResponse.data);
        console.log('✓ Registration successful\n');

        // Test 3: Verifica account
        console.log('Test 3: Verifica account');
        const verificationToken = registerResponse.data.verificationToken;
        const verifyResponse = await axios.post(`${API_URL}/auth/verify`, {
            token: verificationToken
        });
        console.log('Status:', verifyResponse.status);
        console.log('Response:', verifyResponse.data);
        console.log('✓ Account verified\n');

        // Test 4: Login
        console.log('Test 4: Login');
        const loginData = {
            email: 'test6@example.com',
            password: 'test123'
        };
        const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
        console.log('Status:', loginResponse.status);
        console.log('Response:', loginResponse.data);
        console.log('✓ Login successful\n');

        // Test 5: Accesso endpoint protetto
        console.log('Test 5: Accesso endpoint protetto');
        const token = loginResponse.data.token;
        const protectedResponse = await axios.get(`${API_URL}/projects`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Status:', protectedResponse.status);
        console.log('Response:', protectedResponse.data);
        console.log('✓ Protected endpoint accessed successfully\n');

        console.log('All tests completed successfully! ✓');

    } catch (error) {
        console.error('\nTest failed!');
        console.error('Error:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', error.response.data);
        }
    }
}

testAPIs(); 