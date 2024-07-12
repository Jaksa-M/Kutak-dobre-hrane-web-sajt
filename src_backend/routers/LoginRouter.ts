import express from 'express'
import { LoginController } from '../controllers/LoginController'
import multer from 'multer'

const loginRouter = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'slike') // Set the destination folder where files will be uploaded
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Keep the original file name
    }
})

const upload = multer({ storage: storage })

loginRouter.route("/login").post(
    (req,res)=>new LoginController().login(req,res)
)

loginRouter.route("/register").post(
    upload.single('file'), // Middleware for single file upload
    (req, res) => new LoginController().register(req, res)
)

loginRouter.route("/dohvRestorane").get(
    (req,res)=>new LoginController().dohvRestorane(req,res)
)

loginRouter.route("/dohvKonobara").post(
    (req,res)=>new LoginController().dohvKonobara(req,res)
)

loginRouter.route("/dohvGoste").get(
    (req,res)=>new LoginController().dohvGoste(req,res)
)

loginRouter.route("/dohvRezervacije").get(
    (req,res)=>new LoginController().dohvRezervacije(req,res)
)

loginRouter.route("/potvrdi").post(
    upload.single('file'),
    (req,res)=>new LoginController().potvrdi(req,res)
)

loginRouter.route("/promeniLozinku").post(
    (req,res)=>new LoginController().promeniLozinku(req,res)
)

loginRouter.route("/getUser").post(
    (req,res)=>new LoginController().getUser(req,res)
)

loginRouter.route("/dalje").post(
    (req,res)=>new LoginController().dalje(req,res)
)

loginRouter.route("/dohvKorisnike").get(
    (req,res)=>new LoginController().dohvKorisnike(req,res)
)

loginRouter.route("/checkUsername").post(
    (req,res)=>new LoginController().checkUsername(req,res)
)

loginRouter.route("/checkMail").post(
    (req,res)=>new LoginController().checkMail(req,res)
)


export default loginRouter;
