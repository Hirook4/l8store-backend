import express from "express";
import cors from "cors";
import { routes } from "./routes/main.js";
import type { Request, Response, NextFunction } from "express";

/* Criar servidor Express */
const server = express();
/* Ativa o Cors, permitindo requisições GET, POST, PUT, DELETE vindo de outros domínios */
server.use(cors());
/* Torna a pasta public/ acessível via navegador  */
server.use(express.static("public"));
server.use(express.json());
/* Registra todas as rotas para que elas passem a funcionar no servidor */
server.use(routes);

/* Função para tratamento de erros */
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json("error");
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
