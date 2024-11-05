const express = require("express");
const couchbase = require("couchbase");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conectando ao Couchbase
async function connectToCouchbase() {
    const cluster = await couchbase.connect("couchbases://cb.qvkmpmyhetnxfgh.cloud.couchbase.com", {
        username: "admin",
        password: "Oficin@g3"
    });
    const bucket = cluster.bucket("seu_bucket");
    const collection = bucket.defaultCollection();
    return collection;
}

// Rota para adicionar dados
app.post("/adicionar", async (req, res) => {
    const collection = await connectToCouchbase();
    const { id, data } = req.body;
    try {
        await collection.insert(id, data);
        res.status(200).json({ message: "Documento adicionado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar documento" });
    }
});

// Rota para consultar dados
app.get("/consultar/:id", async (req, res) => {
    const collection = await connectToCouchbase();
    const { id } = req.params;
    try {
        const result = await collection.get(id);
        res.status(200).json(result.value);
    } catch (error) {
        res.status(404).json({ error: "Documento não encontrado" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
