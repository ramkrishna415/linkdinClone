import { Router } from "express";
import { acceptConnectionRequest, downloadProfile, getAllUserProfile, getAllUserProfileAndUserBasedOnUsername, getMyConnectionsRequests, getuserandprofile, login, register, sendConnectionRequest, updateProfileData, updateuserprofile, uploadProfilePicture, whatAreMyConnection } from "../controllers/user.controller.js";
import multer from "multer";


const router =Router();


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload = multer({storage:storage})

router.route("/update_profile_picture")
.post(upload.single('profile_picture'),uploadProfilePicture)


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateuserprofile);
router.route("/get_user_and_profile").get(getuserandprofile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_user_profile").get(getAllUserProfile);
router.route("/user_download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequest").get(getMyConnectionsRequests);
router.route("/user/user_connection_request").get(whatAreMyConnection);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getAllUserProfileAndUserBasedOnUsername);


export default router;