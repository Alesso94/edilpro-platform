const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login endpoint...');
        console.log('URL:', 'https://edilpro-platform.onrender.com/api/auth/login');
        
        const loginData = {
            email: 'test3@example.com',
            password: 'test123'
        };
        
        console.log('Request data:', JSON.stringify(loginData, null, 2));
        
        const response = await axios.post('https://edilpro-platform.onrender.com/api/auth/login', loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Login successful!');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', response.data);
        
        if (response.data.token) {
            console.log('Access token received');
            console.log('Token:', response.data.token);
        }
    } catch (error) {
        console.error('Login failed!');
        console.error('Error message:', error.message);
        
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            console.error('Response data:', error.response.data);
        }
        
        if (error.request) {
            console.error('Request made but no response received');
            console.error('Request:', error.request);
        }
    }
}

testLogin(); 