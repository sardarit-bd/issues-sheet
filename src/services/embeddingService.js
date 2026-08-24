async function createEmbedding(text) {
    // Step 1: Validate input
    if (!text || text.trim() === "") {
        throw new Error("Text is required.");
    }

    try {
        const response = await fetch("http://localhost:11434/api/embed", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "nomic-embed-text:latest",
                input: text,
            }),
        });

        
        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
            text,
            embedding: data.embeddings,
        };
    } catch (error) {
        throw error;
    }
}

export default createEmbedding;