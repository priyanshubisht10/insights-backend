const axios = require("axios");

async function getEmotion(body) {
  try {
    const response = await axios.post(
      process.env.DJANGO_SERVER_EMOTIONS_URL,
      body
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
