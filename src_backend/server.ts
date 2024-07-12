import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import loginRouter from './routers/LoginRouter';
import restoranRouter from './routers/RestoranRouter';
import adminRouter from './routers/AdminRouter';

const app = express();
app.use(cors())
app.use(express.json())
app.use('/images', express.static('slike'))
app.use('/images', express.static('jelovnikSlike'))

mongoose.connect('mongodb://127.0.0.1:27017/KutakDobreHrane')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("Pokrenut Back")
})

const router = express.Router()
router.use('', loginRouter)
router.use('/restoran', restoranRouter)
router.use('/admin', adminRouter)

app.use("/" ,router)
app.listen(4000, () => console.log(`Express server running on port 4000`));