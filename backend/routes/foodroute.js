import express from 'express'
import { addfood, listFood, remfood } from '../controllers/controller.js'
import multer from 'multer'

const foodrouter=express.Router()

const storage = multer.diskStorage({
    destination: "uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload=multer({storage})



foodrouter.post('/add',upload.single('image') ,addfood)
foodrouter.get ('/list',listFood)
foodrouter.post('/rem', remfood )







export default foodrouter
