import { BASE_URL, clientServer } from '@/config';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/config/Layout/DashboardLayout';
import UserLayout from '@/config/Layout/userLayout';
import styles from '@/pages/view_profile/styles.module.css'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';


export default function  ViewProfilePage({userProfile}) {
 
  const router=useRouter();
   const postReducer = useSelector((state)=>state.post);
   const dispatch = useDispatch();

   const authState = useSelector((state)=>state.auth)
   const [userPosts, setUserPosts]= useState([]);
   const[isCurrentUserInConnecttion ,setisCurrentUserInConnecttion]=useState(false);
  const [isConnectionNull,setIsConnectionNull]=useState(true);

 //const searchParamers = useSearchParams();

const getUserPost  = async () =>{
      await dispatch(getAllPosts());
      await dispatch(getConnectionRequest({token: localStorage.getItem("token")}));
       await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")})); 
}

useEffect(()=>{
  let post = postReducer.posts.filter((post)=>{
    return post.userId.username === router.query.username
  })
  setUserPosts(post)
},[postReducer.posts])


useEffect(()=>{
  console.log(authState.connections,userProfile.userId._id)
   if(authState.connections.some(user=>user.connectionId?._id === userProfile.userId._id)){
        setisCurrentUserInConnecttion(true)
         if(authState.connections.find(user=>user.connectionId?._id === userProfile.userId._id).status_accepted===true){
        setIsConnectionNull(false)
       }
  }


  if(authState.connectionRequest.some(user=>user.userId?._id === userProfile.userId._id)){
        setisCurrentUserInConnecttion(true)
         if(authState.connectionRequest.find(user=>user.userId?._id === userProfile.userId._id).status_accepted===true){
        setIsConnectionNull(false)
       }
  }
   

        
  },[authState.connections,authState.connectionRequest])


 useEffect(()=>{
  getUserPost();
  console.log(" From view: view profile");
 },[])
//  {userProfile.userId.name}
 
    return (
      <UserLayout>
    <DashboardLayout>
      <div className={styles.container}>
       <div className={styles.backDropContainer}>
        <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />

       </div>
   <div className={styles.profileContainer_detail}>

      <div className={styles.profileContainer_flex}>
         
         <div style={{flex:"0.8"}}>


            <div style={{display:"flex",width:"fit-content", alignItems:"center"}}>
               <h2 style={{marginRight:"10px"}}>{userProfile.userId.name}</h2>
              <p style={{color:"grey"}}>@{  userProfile.userId.username}</p>


         </div>
           <div style={{display:"flex",alignItems:"center",gap:"1.1rem"}}>

           {isCurrentUserInConnecttion ? 
             <button className={styles.connectedButton}>{isConnectionNull ? "pending" :  "Connected" }</button>
           : 
             <button onClick={()=>{
              dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id: userProfile.userId._id
             })
            );
             }} className={styles.connectBtn}>Connect</button>
          }
             
             <div onClick={async()=>{
                const response = await clientServer.get(`/user_download_resume?id=${userProfile.userId._id}`)
                  window.open(`${BASE_URL}/${response.data.message}`,"_blank")
            
            }}  style={{width:"1.4rem" , cursor:"pointer"}}>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>


             </div>
            </div>
            <div>
              <p>{userProfile.bio}</p>
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

              </div>




        </div>



        
      </div>
    </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context){
  console.log("From view");
  
  console.log(context.query.username)
  const request = await clientServer.get("/user/get_profile_based_on_username",{
    params:{
      username: context.query.username
    }
  })
  const response = await request.data;
  console.log(response);
  return {
    props: {userProfile:request.data.Profile}
      
}
}


