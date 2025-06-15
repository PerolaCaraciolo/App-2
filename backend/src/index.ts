import express from 'express';
import cors from 'cors';
import path from 'path';
import humorRoute from './routes/humor';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api/humor', humorRoute);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});