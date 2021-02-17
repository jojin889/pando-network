const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer'); //pour upload img
const upload = multer();          //pour upload img

// ------- Partie AUTH     (exemple: /api/user/register)
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.signOut);

// ------- Partie CRUD USER     (exemple: /api/user/unfollow/:id)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
// put pour update info user
router.put('/:id', userController.updateUser);
// delete pour delete user
router.delete('/:id', userController.deleteUser);
// patch pour les following/followed user
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

router.post('/upload', upload.single('file'), uploadController.uploadProfil)

module.exports = router;