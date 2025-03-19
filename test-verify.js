const axios = require('axios');

async function testVerify() {
    try {
        console.log('Testing account verification...');
        console.log('URL:', 'https://edilpro-platform.onrender.com/api/auth/verify');
        
        const verificationToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RhN2FiZTJmYzhjYTBmYWZkMzgzNGMiLCJpYXQiOjE3NDIzNzE1MTgsImV4cCI6MTc0MjQ1NzkxOH0.2KGSUiDcgAjLWNkX59Y2nkh0JbBuEXCa_OnI0D65od0';
        
        console.log('Verification token:', verificationToken);
        
        const response = await axios.post('https://edilpro-platform.onrender.com/api/auth/verify', {
            token: verificationToken
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Verification successful!');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', response.data);
    } catch (error) {
        console.error('Verification failed!');
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

testVerify(); 