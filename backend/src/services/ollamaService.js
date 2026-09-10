const axios = require('axios');

const askOllama = async (prompt) => {
  try {

    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'deepseek-r1:1.5b',
        prompt: prompt,
        stream: false
      }
    );

    return response.data.response;

  } catch (error) {

    console.error(
      'Ollama Error:',
      error.response?.data || error.message
    );

    throw new Error(
      'Unable to connect to Ollama'
    );
  }
};

module.exports = {
  askOllama
};