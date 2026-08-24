import { QdrantClient } from "@qdrant/js-client-rest";


const qdrant = new QdrantClient({
    url: process.env.QDRANT_CLUSTER_ENDPOINT, //QDRANT_URL
});

await qdrant.createCollection("universities", {

    vectors: {
        size: 1536,
        distance: "Cosine"
    }

});