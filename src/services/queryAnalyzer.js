const STOP_WORDS = new Set([
    "a","an","the","is","are","am","was","were","be","been",
    "of","to","for","and","or","in","on","at","with","by",
    "from","this","that","these","those",
    "my","your","our","their",
    "please","can","could","would","should",
    "i","you","me","we",
    "do","does","did",
    "have","has","had",
    "will","shall",
    "about"
]);

const QUESTION_WORDS = [
    "what",
    "why",
    "when",
    "where",
    "who",
    "which",
    "how"
];

const INTENTS = {
    QUESTION: "question",
    SEARCH: "search",
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    SUMMARIZE: "summarize",
    COMPARE: "compare",
    EXPLAIN: "explain",
    UNKNOWN: "unknown"
};

export default function analyzeQuery(query){

    if(!query?.trim()){
        throw new Error("Query is required");
    }

    const original=query.trim();

    const normalized=original
        .toLowerCase()
        .replace(/[^\w\s]/g," ")
        .replace(/\s+/g," ")
        .trim();

    const tokens=normalized.split(" ");

    const keywords=tokens.filter(word=>!STOP_WORDS.has(word));

    const entities=extractEntities(original);

    const intent=detectIntent(normalized);

    const language=detectLanguage(original);

    const questionType=getQuestionType(normalized);

    const filters=extractFilters(normalized);

    const searchMode=getSearchMode(intent);

    return{

        original,

        normalized,

        tokens,

        keywords,

        entities,

        intent,

        language,

        questionType,

        filters,

        searchMode,

        embeddingText:createEmbeddingText(
            keywords,
            entities
        ),

        searchQuery:createSearchQuery(
            keywords,
            entities
        ),

        confidence:calculateConfidence(
            keywords,
            intent
        ),

        timestamp:Date.now()

    };

}

function detectIntent(query){

    if(QUESTION_WORDS.some(q=>query.startsWith(q)))
        return INTENTS.QUESTION;

    if(/compare|difference|vs|versus/.test(query))
        return INTENTS.COMPARE;

    if(/summary|summarize|overview/.test(query))
        return INTENTS.SUMMARIZE;

    if(/create|generate|make|write/.test(query))
        return INTENTS.CREATE;

    if(/update|edit|modify/.test(query))
        return INTENTS.UPDATE;

    if(/delete|remove/.test(query))
        return INTENTS.DELETE;

    if(/explain|describe/.test(query))
        return INTENTS.EXPLAIN;

    if(/find|search|show|list|get/.test(query))
        return INTENTS.SEARCH;

    return INTENTS.UNKNOWN;

}

function extractEntities(text){

    const entities=[];

    const capitalWords=text.match(/\b[A-Z][a-zA-Z]+\b/g);

    if(capitalWords){

        entities.push(...capitalWords);

    }

    return [...new Set(entities)];

}

function detectLanguage(text){

    const bangla=/[\u0980-\u09FF]/;

    return bangla.test(text)
        ? "bn"
        : "en";

}

function getQuestionType(query){

    if(query.startsWith("what"))
        return "definition";

    if(query.startsWith("why"))
        return "reason";

    if(query.startsWith("how"))
        return "procedure";

    if(query.startsWith("where"))
        return "location";

    if(query.startsWith("when"))
        return "time";

    if(query.startsWith("who"))
        return "person";

    return null;

}

function extractFilters(query){

    return{

        pdf:/pdf/.test(query),

        document:/document|file/.test(query),

        today:/today/.test(query),

        yesterday:/yesterday/.test(query),

        latest:/latest|recent|new/.test(query)

    };

}

function getSearchMode(intent){

    switch(intent){

        case "question":
            return "semantic";

        case "compare":
            return "hybrid";

        case "search":
            return "hybrid";

        default:
            return "semantic";

    }

}

function createEmbeddingText(keywords,entities){

    return [
        ...keywords,
        ...entities
    ].join(" ");

}

function createSearchQuery(keywords,entities){

    return [
        ...keywords,
        ...entities
    ].join(" ");

}

function calculateConfidence(keywords,intent){

    let score=0.5;

    if(keywords.length>2)
        score+=0.2;

    if(intent!=="unknown")
        score+=0.2;

    if(keywords.length>5)
        score+=0.1;

    return Math.min(score,1);

}