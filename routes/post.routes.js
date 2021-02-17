const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('multer'); //pour upload img
const upload = multer();          //pour upload img

// ------- Partie CRUD POST    (exemple: /api/post/create)
router.get('/', postController.readPost);  //read
router.post('/', upload.single('file'), postController.createPost); //create
router.delete('/:id', postController.deletePost); //delete
router.put('/:id', postController.updatePost); //update
router.patch('/like-post/:id', postController.likePost); //
router.patch('/unlike-post/:id', postController.unlikePost); //

// ------- Partie CRUD COMMENTS    (exemple: )
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);


module.exports = router;