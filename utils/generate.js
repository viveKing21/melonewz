const {default: OpenAI} = require("openai");

require('dotenv').config()

const openai = new OpenAI({apiKey: process.env.open_api_key});

const fixQuots = (string) => {
    if(string.at(0) == '"') string = string.slice(1)
    if(string.at(-1) == '"') string = string.slice(0, -1)
    return string
}

const generateRhyme = async (headline) => {
    const prompt = `Generate a rhyming phrase for the headline: '${headline}'`;

    try {
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 50
        });

        const rhyme = response.choices[0].text.trim();

        return fixQuots(rhyme);
    } catch (error) {
        throw error;
    }
};

const generateBiasSummary = async (content) => {
    const prompt = `Provide a bias summary for the following content:\n\n${content}`;

    try {
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 100
        });

        const biasSummary = response.choices[0].text.trim();

        return fixQuots(biasSummary);
    } catch (error) {
        throw error;
    }
};


module.exports = {
    generateRhyme,
    generateBiasSummary
}