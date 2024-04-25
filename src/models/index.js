import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const { sign, verify } = pkg;
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import { getUsuarios, registrarUsuario, verificarCredenciales } from './consultas.js'; 

const validarToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = verify(token, "az_AZ");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};


app.get('/usuarios', getUsuarios);

app.post('/usuarios', async (req, res) => {
    try {
        const nuevoUsuario = req.body;
        const usuarioRegistrado = await registrarUsuario(nuevoUsuario);
        res.status(201).json(usuarioRegistrado);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = sign({ email }, "az_AZ");
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
