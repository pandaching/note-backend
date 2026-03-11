import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 获取所有笔记
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // 转换标签和图片为数组
    const formattedNotes = notes.map((note: any) => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
      images: note.images ? JSON.parse(note.images) : []
    }));
    res.json(formattedNotes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// 创建新笔记
app.post('/api/notes', async (req, res) => {
  try {
    console.log('Received POST request:', req.body);
    const { content, tags, images } = req.body;
    console.log('Extracted data:', { content, tags, images });
    const note = await prisma.note.create({
      data: {
        content,
        tags: JSON.stringify(tags || []),
        images: JSON.stringify(images || [])
      }
    });
    console.log('Created note:', note);
    // 转换标签和图片为数组
    const formattedNote = {
      ...note,
      tags: JSON.parse(note.tags),
      images: JSON.parse(note.images)
    };
    console.log('Formatted note:', formattedNote);
    res.json(formattedNote);
  } catch (error) {
    console.error('Failed to create note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// 更新笔记
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, tags, images } = req.body;
    const note = await prisma.note.update({
      where: { id },
      data: {
        content,
        tags: JSON.stringify(tags || []),
        images: JSON.stringify(images || [])
      }
    });
    // 转换标签和图片为数组
    const formattedNote = {
      ...note,
      tags: JSON.parse(note.tags),
      images: JSON.parse(note.images)
    };
    res.json(formattedNote);
  } catch (error) {
    console.error('Failed to update note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// 删除笔记
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.note.delete({ where: { id } });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Failed to delete note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
