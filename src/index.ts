import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("API funcionando con TypeScript");
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
