const axios = require('axios');

async function testRegister() {
    try {
        console.log('Testing registration endpoint...');
        console.log('URL:', 'https://edilpro-platform.onrender.com/api/auth/register');
        
        const userData = {
            email: 'test3@example.com',
            password: 'test123',
            name: 'Test User 3',
            profession: 'Architetto',
            license: 'ABC123'
        };
        
        console.log('Request data:', JSON.stringify(userData, null, 2));
        
        const response = await axios.post('https://edilpro-platform.onrender.com/api/auth/register', userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Registration successful!');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', response.data);
        
        if (response.data.verificationToken) {
            console.log('Verification token received');
            console.log('Token:', response.data.verificationToken);
        }
    } catch (error) {
        console.error('Registration failed!');
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

testRegister(); 