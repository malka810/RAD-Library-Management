import { Router } from 'express';
import {createBook, getAllBooks, getBookById, updateBook, deleteBook, searchBookByTitle} from '../controllers/book.controller';

const router = Router();

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/search', searchBookByTitle);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
