import { Router } from 'express';
import {
    createReader,
    getAllReaders,
    getReaderById,
    updateReader,
    deleteReader,
    searchReaderByEmail,
    filterReadersByName,
} from '../controllers/reader.controller';

const router = Router();

router.get('/search/by-email', searchReaderByEmail); 
router.get('/filter/by-name', filterReadersByName);
router.post('/', createReader);
router.get('/', getAllReaders);
router.get('/:id', getReaderById);
router.put('/:id', updateReader);
router.delete('/:id', deleteReader);


export default router;
