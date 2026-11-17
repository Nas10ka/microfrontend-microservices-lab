import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
// import cors from 'cors';
import dotenv from 'dotenv';
import Item, { IItem } from './models/Item';
import aiRouter from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/micro_frontend_db';

// app.use(cors({
//     // origin: true,
//     origin: ['http://192.168.31.94:3000','http://localhost:3000',
//     'http://127.0.0.1:3000',
//     'http://localhost:3001',],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
app.use(express.json());
app.use('/api/ai', aiRouter);

mongoose.connect(MONGO_URI)
  .then(() => console.log('🟢 Успішно підключено до локальної MongoDB (TypeScript)'))
  .catch((err: Error) => console.error('🔴 Помилка підключення до MongoDB:', err));


app.get('/api/items', async (req: Request, res: Response) => {
  try {
    const items: IItem[] = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    
    const newItem = new Item({
      title,
      description: description || 'Тестовий опис',
    });

    const savedItem: IItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TS Сервер запущено на http://localhost:${PORT}`);
});