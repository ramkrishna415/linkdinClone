import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js"
import User from "../models/user.model.js";

export const activeCheck =async(req,res)=>{
    return res.status(200).json({message:"running"});
}



export const createPost =async(req,res)=>{
    const { token} =req.body;
    console.log("req.body:", req.body);
   try{
    const user =await User.findOne({token:token});
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    const post = new Post({
        userId:user._id,
        body:req.body.body,
        media:req.file !=undefined ? req.file.filename:"",
        fileType:req.file != undefined ? req.file.mimetype.split("/")[1]:""
    })
     await post.save();
     return res.status(200).json({message:"post created"})

   }catch(err){
    return res.status(500).json({message:err.message});

   }
}

export const getAllPosts = async(req,res)=>{
    try{
      const posts = await Post.find().populate('userId','name username email profilePicture')
      return res.json({posts})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const deletePost = async(req,res)=>{
    const {token, post_id} = req.body;
    try{
        const user =await User
        .findOne({token:token})
        .select("_id");

        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const post = await Post.deleteOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found"})
        }

        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({message:"Unauthorized"})

        }
        await Post.deletePost({_id:post.post_id})
        return res.json({message:"Post Deleted"})
    }catch(err){
     return res.status(500).json({message:err.message})
    }
}



export const commentPost = async(req,res)=>{
    const {token,post_id,commentbody }=req.body;
    try{
        const user= await User.findOne({token:token}).select("_id");

if(!user){
    return res.status(400).json({message:"User not found"})

}
const post = await Post.findOne({
    _id:post_id
});
if(!post){
    return res.status(404).json({message:"post not found"})
}
  const comment = new Comment({
    userId:user._id,
    postId:post_id,
    body:commentbody
  });

  await comment.save();
return res.status(200).json({message:"comment Added"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const get_comments_by_post = async (req,res)=>{
    const {post_id}=req.query;
    try{
      const post = await Post.findOne({_id: post_id});
      if(!post){
        return res.status(404).json({message:"Post not found"})

      }
         const comments=  await Comment.find({postId:post_id})
         .populate("userId","username name profilePicture");


      return res.json(comments.reverse())

    }catch(err){
        return res.status(500).json({message:err.message})

    }
}


export const delete_comment_of_user =async(req,res)=>{
    const {token,comment_id} =req.body;

    try{
 const user = await User
 .findOne({token:token})
 .select("_id");
 if(!user){
    return res.status(404).json({message:"user not found"})

 }
 const comment = await Comment.findOne({"_id":comment_id})
 if(!comment){
    return res.status(404).json({message:"comment not found"})
 }
 if(comment.userId.toString() !== user._id.toString()){
   return res.status(401).json({message:"Unathraized"})

 }
    await Comment.deleteOne({"_id":comment_id});
     return res.json({message:"Comment Deleted"});
    }catch(err){
       return res.status(500).json({message:err.message})
    }
}


export const increment_likes =async(req,res)=>{
    const {post_id} =req.body;
    try{
const post = await Post.findOne({_id:post_id});
if(!post){
    return res.status(404).json({message:"post not found"})
}
post.likes =post.likes+1;
await post.save();
return res.json({message:"Likes Incremented"})

    }catch(err){
       return res.status(500).json({message:err.message})
    }
}



