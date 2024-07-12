import express from 'express'
import { AdminController } from '../controllers/AdminController';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'jelovnikSlike')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Allow files up to 10MB in size
    },
});

const adminRouter = express.Router()

adminRouter.route("/deaktiviraj").post(
    (req,res)=>new AdminController().deaktiviraj(req,res)
)

adminRouter.route("/odblokiraj").post(
    (req,res)=>new AdminController().odblokiraj(req,res)
)

adminRouter.route("/dohvZahteve").get(
    (req,res)=>new AdminController().dohvZahteve(req,res)
)

adminRouter.route("/prihvati").post(
    (req,res)=>new AdminController().prihvati(req,res)
)

adminRouter.route("/odbi").post(
    (req,res)=>new AdminController().odbi(req,res)
)

adminRouter.route("/dodajKonobara").post(
    (req,res)=>new AdminController().dodajKonobara(req,res)
)

adminRouter.route("/proveriRestoran").post(
    (req,res)=>new AdminController().proveriRestoran(req,res)
)

adminRouter.route("/saveCanvas").post(
    upload.array('jelo_image'),
    (req,res)=>new AdminController().saveCanvas(req,res)
);

export default adminRouter;
