import React, {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import { Container, Typography, Avatar, AppBar, Tabs, Tab, useTheme } from "@mui/material"
import PropTypes from 'prop-types';
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
                <BasicTabs />
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
                <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 60, height: 60, mr:3 }} /> : <CustomizedProgressBars />
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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Item Oness" />
            <Tab label="Item Two"/>
            <Tab label="Item Three"/>
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          azerrzer
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Box>
    );
  }

export default SingleProfil