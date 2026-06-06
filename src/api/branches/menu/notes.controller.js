import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addNote(req, res) {
  const { itemId } = req.params;
  const menuItemId = parseInt(itemId, 10);
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });
  try {
    const note = await prisma.menuItemNote.create({ data: { menuItemId, text } });
    return res.status(201).json(note);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteNote(req, res) {
  const { noteId } = req.params;
  const id = parseInt(noteId, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid noteId' });
  try {
    await prisma.menuItemNote.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
