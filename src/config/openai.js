import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

 async function createEmbedding(text) {

    // Step 1: Validate input
     if (!text || text.trim() === "") {
        throw new Error("Text is required.");
    }


    try {

        const response = await client.embeddings.create({
            model: "text-embedding-3-small",
            input: text
        });

        const embedding = response.data[0].embedding;

        return {
            text:text,
            embedding:embedding
        };

    } catch (error) {
        throw error;
    }
}

export default createEmbedding;





