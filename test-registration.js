const axios = require('axios');

async function testRegistration() {
    try {
        const response = await axios.post('https://edilpro-platform.onrender.com/api/auth/register', {
            email: 'test@example.com',
            password: 'test123',
            name: 'Test User',
            profession: 'Architetto',
            license: 'ABC123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Registration successful:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
}

testRegistration(); 