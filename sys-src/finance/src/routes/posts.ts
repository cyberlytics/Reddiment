import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

router.post('/posts', controller.addPost);

export = router;