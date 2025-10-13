import User from "../models/user.model.js";
import Profile from "../models/profile.model.js"
 import bcrypt from "bcrypt";
 import crypto from "crypto";

import PDFDocument from 'pdfkit';
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";
import { profile } from "console";


const convertUserDataToPDF = async(userData)=>{
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex")+".pdf";
    const stream = fs.createWriteStream("uploads/"+outputPath);
    doc.pipe(stream);
     doc.image(`uploads/${userData.userId.profilePicture}`, {align:"center",width:100})
     doc.fontSize(14).text(`Name: ${userData.userId.name}`);
     doc.fontSize(14).text(`Username: ${userData.userId.username}`);
     doc.fontSize(14).text(`Email: ${userData.userId.email}`);
     doc.fontSize(14).text(`Bio: ${userData.bio}`);
     doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);
     doc.fontSize(14).text("Past Work: ");
     userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Company Name:${work.company}`);
        doc.fontSize(14).text(`Position:${work.position}`);
        doc.fontSize(14).text(`Years:${work.years}`);

     })
     doc.end();
     return outputPath;

    }


export const register =async(req,res)=>{
    try{
        const {name, email, password, username}= req.body;
           console.log(req.body);
               if(!name || !email || !password || !username) 
                return res.status(400).json({message:"All field are required"})
                                                             //user.model ke ander chech karega User jo import hai vo hai  
                const user = await User.findOne({     //User^ ke ander check kar raha hai
                    email
                });
                if(user)return res.status(400).json({message:"User already exists"})

                const hashPassword = await bcrypt.hash(password,10);
                  const newUser = new User({
                    name,
                    email,
                    password:hashPassword,
                    username
                  });
                  await newUser.save();

                  const profile = new Profile({userId:newUser._id});
             
              await profile.save();
               return res.json({message:"user created"});
                 
    }catch(err){
      return res.status(500).json({message:err.message})
    }
}

export const login = async(req,res)=>{
    try{
    const {email,password}=req.body;
    if(!email || !password)return res.status(400).json({message:"All field are required"})

        const user =await User.findOne({
            email
        })
        if(!user)return res.status(404).json({message:"user does not exist"})
            const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:"Invaild Credentials"})
            const token =crypto.randomBytes(32).toString("hex");
       await User.updateOne({_id: user._id},{token});
       return res.json({token:token})

    }catch(err){
      return res.status(500).json({message:err.message});
}
} 


export const uploadProfilePicture= async(req,res)=>{
    const {token}=req.body;
    try{
       const user = await User.findOne({token:token})
               if(!user){
                return res.status(400).json({message:"User not found"})
               }
               user.profilePicture = req.file.filename;
               await user.save();
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}




export const updateuserprofile = async(req,res) =>{
   try{
 const {token, ...newuserdata}=req.body;
  
 const user = await User.findOne({token:token})
   if(!user) return res.status(400).json({message:"user are not exist"})
 const {username,email}=newuserdata;

 const existingUser =await User.findOne({$or:[{ username },{ email }]});

 if(existingUser){
    if(existingUser || String(existingUser._id)!==String(user._id)){
        return res.status(400).json({message:'user already exists'});

    }
 }

 Object.assign(user,newuserdata);
  await user.save();
  return res.json({message:'user updated'})
}catch(err){
    return res.status(500).json({message:err.message});
   } 
}



export const getuserandprofile=async(req,res)=>{
    try{
        const {token }=req.query;   //body hoga to backend me work karega keval
        const user =await User.findOne({token:token});
        if(!user)
            return res.status(400).json({message:"User not fount"});

        
        const userprofile = await Profile.findOne({userId: user._id})
        .populate('userId','name email username profilePicture');
           return res.json({Profile: userprofile})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}



export const updateProfileData =async(req,res)=>{
   try{
    const{token, ...newprofiledata}=req.body;
    const userProfile =await User.findOne({token:token});
    if(!userProfile){
        return res.status(400).json({message:"user not found"});

    }
    const profile_to_update =await Profile.findOne({userId:userProfile._id});
    Object.assign(profile_to_update,newprofiledata);
 await profile_to_update.save();
 return res.json({message:"profile updated"});
   }catch(err){
    return res.status(500).json({message: err.message});
   } 
}



export const getAllUserProfile =async(req,res) =>{
    try{
        const profiles = await Profile.find().populate('userId','name username email profilePicture');
        return res.json({profiles})


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const downloadProfile =async(req,res)=>{
    const user_id =req.query.id;

    const userProfile = await Profile.findOne({userId:user_id})
    .populate('userId','name username email profilePicture');
       
     if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }


    let outputPath =await convertUserDataToPDF(userProfile);
    return res.json({message: outputPath});
};

export const sendConnectionRequest =async(req,res)=>{
    const {token,connectionId} = req.body;

    try{
        const user =await User.findOne({token});

        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        const connectionUser = await User.findOne({_id: connectionId})
         
        if(!connectionUser){
            return res.status(404).json({message:"Congratulation User not found"});

        } 
        const existingRequest = await ConnectionRequest.findOne({
            userId:user._id,
            connectionsId:connectionUser._id
        })
        if(existingRequest){
            return res.status(400).json({message:"Request already send"})

        }
        const request = new ConnectionRequest({
            userId: user._id,
            connectionId:connectionUser._id
        });
        await request.save();

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const getMyConnectionsRequests = async(req,res) =>{
    const{token} = req.query;
    try{
     const user = await User.findOne({token});
     if(!user){
        return res.status(400).json({message: "User not found"})
     }
     const connection = await ConnectionRequest.find({userId: user._id})
     .populate('connectionId','name username email profilePicture');
     return res.json({connections: connection})
       
    }catch(err){
      return res.status(500).json({message:err.message});
    }
}


export const whatAreMyConnection = async(req,res)=>{
    const{token} = req.query;
if (!token) {
      return res.status(400).json({ message: "Token not provided" });
    }

    try{

        const user = await User.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        const connections = await ConnectionRequest.find({connectionId:user._id})
        .populate('userId',"name username email profilePicture");
        return res.json(connections);


    }catch(err){
        return res.status(404).json({message:err.message});
    }
}


export const acceptConnectionRequest= async(req,res)=>{
    const {token,requestId,action_type}=req.body;
    try{
         const user = await User.findOne({token});

         if(!user){
            return res.status(400).json({message:"user not found"})
         }
         const connections = await ConnectionRequest.findOne({_id: requestId});
           
          if(!connections){
            return res.status(400).json({message:"Connection not found"})

          }
          if(action_type === "accept"){
            connections.status_accepted=true;
          }else{
            connections.status_accepted=false;
          }

    await connections.save();
    return res.json({message:"Request Updated"});


    }catch(err){
      return res.status(500).json({message:err.message});
    }
}


export const getAllUserProfileAndUserBasedOnUsername = async(req,res)=>{
 
  try{
     const {username} = req.query;
    
    const user = await User.findOne({
        username
    });
    
    if(!user){
        return res.status(400).json({message:"user not found"});

    }
    const userProfile = await Profile.findOne({userId:user._id})
    .populate('userId','name username email profilePicture')

    return res.json({'Profile': userProfile})

  }catch(err){
    return res.status(500).json({message:err.message});
  }
}






