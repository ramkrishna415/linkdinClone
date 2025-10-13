import UserLayout from '@/config/Layout/userLayout'
import DashboardLayout from '@/config/Layout/DashboardLayout'
import React, { useEffect } from 'react'
   import styles from "@/pages/my_Connection/styles.module.css"
import { connect, useDispatch, useSelector } from 'react-redux'
import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'
import { connection } from 'next/server'
  


   export default function My_connection() {
    
    const dispatch =useDispatch();
    const authState = useSelector((state)=>state.auth)
  const router= useRouter();
    
    useEffect(()=>{
 dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
    },[])

    useEffect(()=>{
          if(authState.connectionRequest?.length != 0){
            console.log(authState.connectionRequest)
          }
    },[authState.connectionRequest])

    return (
    <UserLayout>
        <DashboardLayout>
          <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>
        <h4>My_connection</h4>
          {authState.connectionRequest.length ===0 && <h2>No connection Request pending</h2>}
         
      
      {authState.connectionRequest.length!=0 && authState.connectionRequest.filter((connection)=>connection.status_accepted===null).map((user, index)=>{
        return(
          // <h1>{user.userId.name}</h1>
       <div onClick={()=>{
             router.push(`/view_profile/${user.userId.username}`)
       }} className={styles.userCard} key={index}>
        <div style={{display:"flex",alignItems:"center", gap:"1.2rem"}}>
          <div className={styles.profilePicture}>
            <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
         
          </div>
        <div className={styles.userInfo}>
          <h3>{user.userId.name}</h3>
          <p>@{user.userId.username}</p>
        </div>
        <button onClick={(e)=>{
             e.stopPropagation();
             dispatch(AcceptConnection({
              connectionId:user._id,
              token:localStorage.getItem('token'),
              action:"accept"
             }))
        }} className={styles.connectedButton}>Accept</button>
        </div>
       </div>
       
       
       
        )
      })}
      <h4>My Network</h4>
      {authState.connectionRequest.filter((connection)=>connection.status_accepted!==null).map((user, index)=>{
      return(
         <div onClick={()=>{
             router.push(`/view_profile/${user.userId.username}`)
       }} className={styles.userCard} key={index}>
        <div style={{display:"flex",alignItems:"center", gap:"1.2rem"}}>
          <div className={styles.profilePicture}>
            <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
         
          </div>
        <div className={styles.userInfo}>
          <h3>{user.userId.name}</h3>
          <p>@{user.userId.username}</p>
        </div>
        
        </div>
       </div>

      )

      }
      )}

</div>
    </DashboardLayout>
    </UserLayout>
  )
} 
