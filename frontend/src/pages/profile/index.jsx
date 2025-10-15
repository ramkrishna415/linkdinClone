import UserLayout from '@/config/Layout/userLayout'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/config/Layout/DashboardLayout'
import { getAboutUser } from '@/config/redux/action/authAction'
import styles from '@/pages/profile/index.module.css'
import { BASE_URL, clientServer } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '@/config/redux/action/postAction'


export default function ProfilePage() {

const authState =useSelector((state)=>state.auth)
const postReducer = useSelector((state)=>state.post)
const dispatch = useDispatch();

const [userProfile, setUserProfile]=useState({
  
    
    // userId:{
    //     name: "",
    //     username: "",
    //     profilePicture: ""
    // },
    // bio:"",
    // pastWork:[]
})
 const [userPosts, setUserPosts]=useState([]) 
const [isModalOpen ,setIsModalOpen]=useState(false);
const [isModalOpens ,setIsModalOpens]=useState(false);

const [inputData, setInputData] = useState({company:'',position:'',years:''});

 const [inputDatas, setInputDatas] = useState({school:'',degree:'',fieldOfStudy:''});

 const handleWorkInputChanges = (e)=>{
const {name, value}=e.target;
setInputDatas({...inputDatas,[name]:value})
 }

 const handleWorkInputChange = (e)=>{
const {name, value}=e.target;
setInputData({...inputData,[name]:value})
 }
 


useEffect(()=>{
    dispatch(getAboutUser({token:localStorage.getItem("token")}))
         dispatch(getAllPosts())
},[])

useEffect(()=>{
    if(authState.user != undefined){
setUserProfile(authState.user)
 let post = postReducer.posts.filter((post)=>{
     return post.userId.username === authState.user.userId.username
   })
   console.log(post);
   setUserPosts(post);
    }

},[authState.user,postReducer.posts])

const updateProfiePicture = async(file)=>{
    const formData = new FormData();
    formData.append("profile_picture",file);
    formData.append("token",localStorage.getItem("token"));
    const response =await clientServer.post("/update_profile_picture",formData,{
        headers:{
            'Content-Type':'multipart/form-data',
        },
    });

    dispatch(getAboutUser({token:localStorage.getItem("token")}))
}

const updateProfileData = async ()=>{
    const request = await clientServer.post('/user_update',{
        token: localStorage.getItem("token"),
        name: userProfile.userId.name,
    });
    const response = await clientServer.post("/update_profile_data",{
        token:localStorage.getItem("token"),
        bio:userProfile.bio,
        currentPost:userProfile.currentPost,
         pastWork:userProfile.pastWork,
         education:userProfile.education
    });
    dispatch(getAboutUser({token:localStorage.getItem("token")}));
}



  return (
    <UserLayout>
       <DashboardLayout>

        {authState.user && userProfile.userId &&
<div className={styles.container}>
       <div className={styles.backDropContainer}>
       <div className={styles.backDrop} >
        <label htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
            <p>Edit</p>

        </label>
          <input onChange={(e)=>{
            updateProfiePicture(e.target.files[0])
          }} hidden  type="file" id='profilePictureUpload' />
        <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />
  </div>
       </div>
   <div className={styles.profileContainer_detail}>

      <div className={styles.profileContainer_flex}>
         
         <div style={{flex:"0.8rem"}}>


            <div style={{display:"flex",width:"fit-content", alignItems:"center"}}>

                <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{
                    setUserProfile({...userProfile,userId:{...userProfile.userId,name:e.target.value}})
                }} />
               {/* <h2 style={{marginRight:"10px"}}>{userProfile.userId.name}</h2> */}
              <p contentEditable style={{color:"grey"}}>@{  userProfile.userId.username}</p>


         
          

            
            </div>
            <div>
              {/* <p>{userProfile.bio}</p> */}
              <textarea value={userProfile.bio} onChange={(e)=>{
                setUserProfile({...userProfile,bio:e.target.value});
              }}
              rows={Math.max(3,Math.ceil(userProfile.bio.length/88))}  //adject as need
              style={{width:"100%",}}></textarea>
            </div>


         </div>
  <div style={{flex:"0.4"}}>
               <h2>Recent Activity</h2>
                {userPosts.map((post)=>{
                  return(
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                           
                       {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="" /> : <div style={{width:'3.4rem',height:"3.4rem"}}></div>}

                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  )
                })}

  </div>
      </div>
   </div>
        
        <div className="workhistory">
          <p>Work History</p>
              <div className={styles.workhistory_container}>
                {
                  userProfile.pastWork.map((work,index)=>{
                    return(
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:"0.8rem"}}>{work.company}-{work.position}

                        </p>
                        <p>{work.years}</p>

                      </div>
                    )
                  })
                }
           <button className={styles.addWorkButton} onClick={()=>{
            setIsModalOpen(true)
           }}>Add Work</button>
              </div>
        </div>
                  


                   <div className="workhistory">
          <p>Education</p>
              <div className={styles.workhistory_container}>
                {
                  userProfile.education.map((education,index)=>{
                    return(
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:"0.8rem"}}>{education.school}

                        </p>
                        <p>{education.degree}</p>
                        <p>{education.fieldOfStudy}</p>

                      </div>
                    )
                  })
                }
           <button className={styles.addWorkButton} onClick={()=>{
            setIsModalOpens(true)
           }}>Add education</button>
              </div>
        </div>

           {userProfile != authState.user && 
           <div onClick={()=>{
            updateProfileData();
           }}  className={styles.updateButton}>
                update profile
            </div>}

     
        
      </div>
          }


{/* this is user for Add work */}


             {
            isModalOpen &&
             <div onClick={()=>{
              setIsModalOpen(false);
             }}
              className={styles.currentContainer}>

               <div  onClick={(e)=>{
                e.stopPropagation()
               }}
                className={styles.allCurrentContainer}>
                     
                <input onChange={handleWorkInputChange} name='company' className={styles.inputField} type="text" placeholder='Enter Company' />
                <input onChange={handleWorkInputChange} name='position' className={styles.inputField} type="text" placeholder='Enter Position' />
                <input onChange={handleWorkInputChange} name='years' className={styles.inputField} type="number" placeholder='years' />
                 <div onClick={()=>{
                    setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,inputData]})
                    setIsModalOpen(false);
                 }} className={styles.updateButton}>Add work</div>
               </div>

             </div>
            }

            {/* this is used for add education  */}

               
                   {
            isModalOpens &&
             <div onClick={()=>{
              setIsModalOpens(false);
             }}
              className={styles.currentContainer}>

               <div  onClick={(e)=>{
                e.stopPropagation()
               }}
                className={styles.allCurrentContainer}>
                     
                <input onChange={handleWorkInputChanges} name='school' className={styles.inputField} type="text" placeholder='Enter school' />
                <input onChange={handleWorkInputChanges} name='degree' className={styles.inputField} type="text" placeholder='Enter degree' />
                <input onChange={handleWorkInputChanges} name='fieldOfStudy' className={styles.inputField} type="number" placeholder='Enter fieldOfStudy' />
                 <div onClick={()=>{
                    setUserProfile({...userProfile,education:[...userProfile.education,inputDatas]})
                    setIsModalOpens(false);
                 }} className={styles.updateButton}>Add Education</div>
               </div>

             </div>
            }




       </DashboardLayout>
    </UserLayout>
  )
}
