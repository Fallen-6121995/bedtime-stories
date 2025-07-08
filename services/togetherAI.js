const axios = require("axios");

const generateStory = async (prompt) => {
  const res = await axios.post(
    "https://api.together.xyz/v1/chat/completions",
    {
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      prompt,
    //   max_tokens: 500,
      temperature: 0.8,
      stop: ["###"]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
  console.log("res>>>",JSON.stringify(res.data.choices[0].message.content));
  return res.data.choices[0].message.content;
};

module.exports = { generateStory };