import React, {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import { Container, Typography, Avatar  } from "@mui/material"
import Box from '@mui/material/Box';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, storage} from "../../backend/config";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import CustomizedProgressBars from '../../composants/FacebookCircularProgress'

const SingleProfil = () => {

    const params = useParams();
    const [lieux,setLeiux] = useState();
    const [user,setUser] = useState();
    const [avatar, setAvatar] = useState();

    useEffect( () => {
    const profilCol = collection(db, 'users')
     const getProfil = async () => {
        await getDocs(profilCol).then(snap => {
             snap.forEach(doc => {
                 if(doc.id == params.id){
                    setUser({...doc.data(), id: doc.id})
                    }
                })
            })
        }
        getProfil()
    },[])


    const getAvatar = async () => {
            const refs = ref(storage, "avatar");
            await listAll(refs)
            .then((res) => {
                res.items.forEach((item) => {
                    if(user && item.name == user.avatar){
                        getDownloadURL(item).then((url) => {
                        setAvatar(url);
                    });
                }
            });
        }).catch((erreur) => console.log(erreur));
    }

    if(user){
        getAvatar()
    }

    return(
        <Box sx={{ mt:5 }}>
            <Container>
                <UserInfo user={user} avatar={avatar} />
            </Container>
        </Box>
    )
}

function UserInfo(props){

    const {user, avatar} = props


    return(
        <Box>
            <Box sx={{ display: 'flex', alignItems: "center" }}>
                {avatar ?
                <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 60, height: 60, mr:3 }} />
                :
                <CustomizedProgressBars />
                }

                <Typography variant="h5" componant="h1" >{user && user.pseudo} </Typography>
            </Box>
            <Box sx={{ my:5 }}>
                <Typography variant="div" componant="div">
                    {user && user.description != "" ? user.description : "Pas de description" }
                </Typography>
            </Box>
        </Box>
    )
}

export default SingleProfil