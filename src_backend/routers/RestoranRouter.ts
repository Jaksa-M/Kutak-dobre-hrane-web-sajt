import express from 'express'
import { RestoranController } from '../controllers/RestoranController';

const restoranRouter = express.Router()

restoranRouter.route("/restoranInfo").post(
    (req,res)=>new RestoranController().restoranInfo(req, res)
)

restoranRouter.route("/rezervisi").post(
    (req,res)=>new RestoranController().rezervisi(req, res)
)

restoranRouter.route("/dohvRezervacije").get(
    (req,res)=>new RestoranController().dohvRezervacije(req, res)
)

restoranRouter.route("/dohvSvojeRezervacije").post(
    (req,res)=>new RestoranController().dohvSvojeRezervacije(req, res)
)

restoranRouter.route("/dohvRezervacijeKonobar").post(
    (req,res)=>new RestoranController().dohvRezervacijeKonobar(req, res)
)

restoranRouter.route("/dohvRezervacijeRestoran").post(
    (req,res)=>new RestoranController().dohvRezervacijeRestoran(req, res)
)

restoranRouter.route("/otkazi").post(
    (req,res)=>new RestoranController().otkazi(req, res)
)

restoranRouter.route("/dohvAdresu").post(
    (req,res)=>new RestoranController().dohvAdresu(req, res)
)

restoranRouter.route("/oceni").post(
    (req,res)=>new RestoranController().oceni(req, res)
)

restoranRouter.route("/dohvRestoran").post(
    (req,res)=>new RestoranController().dohvRestoran(req, res)
)

restoranRouter.route("/potvrdi").post(
    (req,res)=>new RestoranController().potvrdi(req, res)
)

restoranRouter.route("/odbi").post(
    (req,res)=>new RestoranController().odbi(req, res)
)

restoranRouter.route("/sePojavio").post(
    (req,res)=>new RestoranController().sePojavio(req, res)
)

restoranRouter.route("/produzi").post(
    (req,res)=>new RestoranController().produzi(req, res)
)

restoranRouter.route("/zavrsiNarudzbinu").post(
    (req,res)=>new RestoranController().zavrsiNarudzbinu(req, res)
)

restoranRouter.route("/dohvNarudzbine").get(
    (req,res)=>new RestoranController().dohvNarudzbine(req, res)
)

restoranRouter.route("/dohvNarudzbineGost").post(
    (req,res)=>new RestoranController().dohvNarudzbineGost(req, res)
)

restoranRouter.route("/potvrdiNarudzbinu").post(
    (req,res)=>new RestoranController().potvrdiNarudzbinu(req, res)
)

restoranRouter.route("/odbijNarudzbinu").post(
    (req,res)=>new RestoranController().odbijNarudzbinu(req, res)
)

restoranRouter.route("/updateCanvas").post(
    (req,res)=>new RestoranController().updateCanvas(req, res)
)

export default restoranRouter;