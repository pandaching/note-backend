var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import cors from 'cors';
import { PrismaClient } from './src/generated/client';
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
// 获取所有笔记
app.get('/api/notes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield prisma.note.findMany({
            orderBy: { createdAt: 'desc' }
        });
        // 转换标签和图片为数组
        const formattedNotes = notes.map((note) => (Object.assign(Object.assign({}, note), { tags: note.tags ? JSON.parse(note.tags) : [], images: note.images ? JSON.parse(note.images) : [] })));
        res.json(formattedNotes);
    }
    catch (error) {
        console.error('Failed to fetch notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
}));
// 创建新笔记
app.post('/api/notes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, tags, images } = req.body;
        const note = yield prisma.note.create({
            data: {
                content,
                tags: JSON.stringify(tags || []),
                images: JSON.stringify(images || [])
            }
        });
        // 转换标签和图片为数组
        const formattedNote = Object.assign(Object.assign({}, note), { tags: JSON.parse(note.tags), images: JSON.parse(note.images) });
        res.json(formattedNote);
    }
    catch (error) {
        console.error('Failed to create note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
}));
// 更新笔记
app.put('/api/notes/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { content, tags, images } = req.body;
        const note = yield prisma.note.update({
            where: { id },
            data: {
                content,
                tags: JSON.stringify(tags || []),
                images: JSON.stringify(images || [])
            }
        });
        // 转换标签和图片为数组
        const formattedNote = Object.assign(Object.assign({}, note), { tags: JSON.parse(note.tags), images: JSON.parse(note.images) });
        res.json(formattedNote);
    }
    catch (error) {
        console.error('Failed to update note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
}));
// 删除笔记
app.delete('/api/notes/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.note.delete({ where: { id } });
        res.json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
