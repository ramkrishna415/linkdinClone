
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./styles.module.css"

import { emptyMessage } from '@/config/redux/reducer/authReducer'
import UserLayout from '@/config/Layout/userLayout'
import { loginUser, registerUser } from '@/config/redux/action/authAction'

function LoginComponent() {


  const authState = useSelector((state)=>state.auth) //store se aa raha hai

const router = useRouter();
const dispatch = useDispatch();

const [userLoginMethod,setUserLoginMethod]=useState(false);
const[email,setEmail]=useState("");
const [password,setPassword]=useState("");
const[username,setUsername]=useState("");
const[name,setName]=useState("");




useEffect(()=>{
  if(authState.loggedIn){  //auth reducer se aaya hai
    router.push("/dashboard")
  }
},[authState.loggedIn, router])

useEffect(()=>{
  if(localStorage.getItem("token")){
    router.push("/dashboard");
  }
},[])

  useEffect(()=>{   //clear the message
  dispatch(emptyMessage());
},[userLoginMethod])

const handleRegister =()=>{
  console.log("ram");
 dispatch(registerUser({username, password, email, name}))

}

const handleLogin =()=>{
  console.log("login");
 dispatch(loginUser({email, password}))
}

  return (
    <UserLayout>
      <div className={styles.container}>

     <div className={styles.cardContainer}>

      <div className={styles.cardContainer_left}>
       <p className={styles.cardleft_heading}>{userLoginMethod ? "Sign In":"Sign Up"}</p>
           <p style={{color: authState.isError? "yellow":"green"}}>  {authState.message.message}</p>

                    {/* <p>{authState.message.message}</p> */}

          <div className={styles.inputContainer}>

           {!userLoginMethod &&   <div className={styles.inputRow}>
              <input onChange={(e)=> setUsername(e.target.value)} className={styles.inputField} type="text" placeholder='username'/>
              <input onChange={(e)=> setName(e.target.value)}  className={styles.inputField} type="text" placeholder='name'/>
            </div> }
          
               <input onChange={(e)=> setEmail(e.target.value)} className={styles.inputField} type="email" placeholder='email'/>
               <input onChange={(e)=> setPassword(e.target.value)} className={styles.inputField} type="password" placeholder='password'/>
           
            <div onClick={()=>{
              if(userLoginMethod){
                  handleLogin(); 
              }else{
                handleRegister();
              }
            }}
            
            
            className={styles.buttonWithOutline}>
              <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
            </div>
          </div>

      </div>

<div className={styles.cardContainer_right}>
            <div> 
              {userLoginMethod ? <p>Don't have on Account ? </p> : <p>Already have an Account</p>}
            {/* <p>Already have an account</p> */}
            <div onClick={()=>{
              setUserLoginMethod(!userLoginMethod)
            }}
            
            
           style={{color: "white",textAlign:"center"}} className={styles.buttonWithOutline}>
              <p>{userLoginMethod ? " Sign Up" : "Sign In"}</p>
            </div>
      </div>
     </div>
     </div>
    </div>


    </UserLayout>
  )
}

export default LoginComponent

