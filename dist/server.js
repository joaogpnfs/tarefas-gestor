"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const schema_1 = require("./database/schema");
const projetos_1 = __importDefault(require("./routes/projetos"));
const tarefas_1 = __importDefault(require("./routes/tarefas"));
const membros_1 = __importDefault(require("./routes/membros"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4321;
(0, schema_1.initializeDatabase)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/projetos', projetos_1.default);
app.use('/api/tarefas', tarefas_1.default);
app.use('/api/membros', membros_1.default);
const webDistPath = path_1.default.join(__dirname, '../web/dist');
const fs = require('fs');
if (process.env.NODE_ENV !== 'test' && fs.existsSync(webDistPath)) {
    app.use(express_1.default.static(webDistPath));
    app.use((req, res) => {
        res.sendFile(path_1.default.join(webDistPath, 'index.html'));
    });
}
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
exports.default = app;
