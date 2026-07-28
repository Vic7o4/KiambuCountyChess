// Updated handleMpesaPrompt function to fix error handling for M-PESA STK Push

handleMpesaPrompt = async () => {
    try {
        const response = await initiateMpesaTransaction();
        if (!response.success) {
            throw new Error(response.message || 'Transaction failed');
        }
        // Handle success
    } catch (error) {
        console.error('M-PESA STK Push Error:', error.message);
        // Update the UI to show error to the user
    }
};
