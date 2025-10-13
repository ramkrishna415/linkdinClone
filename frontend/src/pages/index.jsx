import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/config/Layout/userLayout";
const inter = Inter({subsets: ["latin"],
});

export default function Home() {
  const router =useRouter();

  return (
    <UserLayout>
      
     <div className={styles.container}>

      <div className={styles.mainContainer}>

      
        <div className={styles.mainContainer_left}>
          
          <p>Connect with Friend without Exaggeration</p>
           <p>A True social media platform,with stories no blufs </p>
             
             <div onClick={()=>{
             router.push("/login")  //login page ka foldar  hai n u ham likhe hai then ushke ander kam kar lega next.js 
             }}
              className={styles.buttonJoin}>
              <p>Join Now</p>
             </div>
             
        </div>

         <div className={styles.mainContainer_right}>
          <img src="images\connecting.png" style={{height:"500px"}} alt="image"/>

         </div>
      </div>

     </div>
      
    
       
           
         
      
    </UserLayout>
  );
}
