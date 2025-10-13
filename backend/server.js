import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import postRoutes from "./routes/post.routes.js"
import userRoutes from "./routes/user.routes.js"
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());//ye upar rahega
app.use(userRoutes);
app.use(postRoutes);   //router me hai 
app.use(express.static("uploads"))


// app.get('/r', (req, res) => {
//   res.send('Server is running!');
// });
// app.get("/ram", (req, res) => {
//     res.send("hello");
// });


const start = async ()=>{
    const connecting = await mongoose.connect(process.env.MONGO_DB);

app.listen(9080,()=>{
    console.log("server is running on the port 9080")
})

};
start();