import express from 'express';
import { Registro } from '../models/Registro';

const router = express.Router();
const registros: Registro[] = [];

router.post('/', (req, res) => {
  const { humor, comentario, latitude, longitude, imagemBase64 } = req.body;
  const registro: Registro = {
    humor,
    comentario,
    latitude,
    longitude,
    imagemBase64,
    timestamp: new Date().toISOString(),
  };
  registros.push(registro);
  res.status(201).json({ message: 'Registro salvo com sucesso!', registro });
});

router.get('/', (req, res) => {
  res.json(registros);
});

export default router;