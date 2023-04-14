import React from 'react'
import SideBar from '../components/SideBar'
import IconButton from '@mui/material/IconButton';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { FileUploader } from "react-drag-drop-files";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {db,storage} from '../firebase'
import {getDoc,deleteDoc,doc,getDocs,updateDoc,setDoc,collection,onSnapshot} from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';


const fileType=['pdf','doc','docx','ppt','pptx','xls','xlsx','txt','csv','zip','rar','7z','tar','gz','tar.gz','tar.bz2','tar.xz','tar.lz','tar.lzma','tar.lzo','tar.sz','tar.Z','tar.zst','tar.lz4',
'tar.lz4','tar.z','mp4','mkv','avi','mov','wmv','flv','mpg','mpeg','webm','ogg','ogv','m4v','3gp','3g2','3gpp','3gpp2','3g','mp3',
'wav','wma','aac','flac','m4a','m4b','m4p','m4r','m4v','mka','png','jpeg','jpg','gif','bmp','svg','webp','psd','ai','eps','indd','raw','cr2','nef','orf','sr2','tif','tiff','dng','jxr','hdp','wdp','jpm','jpx','heic','ktx','ktx2','jng','svg','ico','icns','bpg','jp2','j2k','jpf','jpx','jpm','mj2','mjp2','jxr','hdp','wdp','avif','heif','heic','heics','heifs','avifs','pdf','doc','docx','ppt','pptx','xls','xlsx','txt','csv','zip','rar','7z','tar','gz','tar.gz','tar.bz2','tar.xz','tar.lz','tar.lzma','tar.lzo','tar.sz','tar.Z','tar.zst','tar.lz4',]


function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}









const Marketplace = () => {

  const [open, setOpen] = React.useState(false);
  const [title,setTitle]=React.useState('')
  const [description,setDescription]=React.useState('')
  const [thumbnail,setThumbnail]=React.useState('')
  const [currentPreview,setCurrentPreview]=React.useState('')
  const [content,setContent]=React.useState('')
  const [value, setValue] = React.useState(0);
  const [itemData,setItemData]=React.useState([])
  const [userDataItems,setUserDataItems]=React.useState([])
  const [favourites,setFavorites]=React.useState([])

  const user=useSelector(state=>state.user.value)

  let navigate=useNavigate()
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFileChange=(uploadedFile)=>{
    
    setContent(uploadedFile)
    console.log(uploadedFile)
  
  }

  React.useEffect(()=>{
    const getFavourites=async()=>{
      const docRef = doc(db, "UserInfo", user.email);
      const docSnap = await getDoc(docRef);
      let data=docSnap.data().favourites
      let tempArr=[]
      for(let i=0;i<data.length;i++){
        let temp=await getDoc(doc(db, "Marketplace", data[i]));
        tempArr.push(temp.data())
      }
      setFavorites(tempArr)
    }
    getFavourites()


  },[])

  React.useEffect(()=>{
    
    const getItems=async()=>{
       onSnapshot(collection(db, "Marketplace"), (querySnapshot) => {
        let temp=[]
        querySnapshot.forEach((doc) => {
            temp.push(doc.data())
        });
        setItemData(temp)
        
      })
    }
    getItems()
  
  ,[0]})



  React.useEffect(()=>{
    
    const getUserItems=async()=>{
        onSnapshot(collection(db, "Marketplace"), (querySnapshot) => {
        let temp=[]
        querySnapshot.forEach((doc) => {
            if(doc.data().email===user.email){
              temp.push(doc.data())
            }
        })
        setUserDataItems(temp)
        })}


    getUserItems()



  
  ,[0]})


  const handleDelete=async (id)=>{
    await deleteDoc(doc(db, "Marketplace", id));
  }
    


  const handlePictureChange=(e)=>{
    setCurrentPreview(URL.createObjectURL(e.target.files[0]))
    setThumbnail(e.target.files[0])
  }

  const handleSubmit=()=>{
    let thumbnailId=nanoid()
    const storageRef = ref(storage, 'Thumbnail/' + thumbnailId);
    const storageRef2=ref(storage,'Content/'+thumbnailId)
    const uploadTask = uploadBytesResumable(storageRef, thumbnail);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {}, 
  (error) => console.log(error), 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      const uploadTask2=uploadBytesResumable(storageRef2,content)
      uploadTask2.on('state_changed',
      (snapshot) => {},
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask2.snapshot.ref).then((downloadURL2) => {
          setDoc(doc(db,'Marketplace',thumbnailId),{
            email:user.email,
            title:title,
            description:description,
            thumbnail:downloadURL,
            content:downloadURL2,
            id:thumbnailId,
            fileType:content.type,

  })}
  )})
  })})
  handleClose()
  navigate('/Marketplace')

}

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };




  return (
    <SideBar>
        <Fab sx={{position:'fixed',right:'20px',bottom:'20px'}} color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddToQueueIcon  />
        </Fab>

        <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Store" {...a11yProps(0)} />
            <Tab label="Published Notes" {...a11yProps(1)} />
            <Tab label="Favourites" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>


        <ImageList variant="masonry" cols={6} >
          <ImageListItem key="Subheader"  >
              </ImageListItem>
              {itemData.map((item) => (
                <ImageListItem key={item.id} >
                  <img
                    src={`${item.thumbnail}`}
                    srcSet={`${item.thumbnail}`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.title}
                    subtitle={item.author}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${item.title}`}
                        onClick={()=>navigate(`/Marketplace/${item.id}`)}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>

        </TabPanel>




        <TabPanel value={value} index={1}>
          <ImageList variant="standard" cols={6} >
          <ImageListItem key="Subheader"  >
              </ImageListItem>
              {userDataItems.map((item) => (
                <ImageListItem key={item.id} >
                  <img
                    src={`${item.thumbnail}`}
                    srcSet={`${item.thumbnail}`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.title}
                    subtitle={item.author}
                    actionIcon={
                      <IconButton
                     
                        aria-label={`info about ${item.title}`}
                        color="error"
                        onClick={()=>handleDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
        </TabPanel>
        <TabPanel value={value} index={2}>

              <ImageList variant="masonry" cols={6} >
                <ImageListItem key="Subheader"  >
                    </ImageListItem>
                    {favourites.map((item) => (
                      <ImageListItem key={item.id} >
                        <img
                          src={`${item.thumbnail}`}
                          srcSet={`${item.thumbnail}`}
                          alt={item.title}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          title={item.title}
                          subtitle={item.author}
                          actionIcon={
                            <IconButton
                              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                              aria-label={`info about ${item.title}`}
                              onClick={()=>navigate(`/Marketplace/${item.id}`)}
                            >
                              <InfoIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>

        </TabPanel>
      </Box>
















        <Dialog
        open={open}
    
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        fullWidth={true}
        maxWidth={'md'}
  
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Add Content
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Stack spacing={2}>
              <TextField sx={{mt:2}} id="outlined-basic" label="Title" value={title} onChange={(event)=>setTitle(event.target.value)} variant="outlined" fullWidth/>
              <TextField rows={4} id="outlined-basic" label="Description" value={description} onChange={(event)=>setDescription(event.target.value)} variant="outlined" multiline fullWidth/>
              <Grid container>
                <Grid sx={{display:'flex',justifyContent:'center',alignItems:'center'}}item xs={6}>
                  <Stack>
                    <Typography variant="h6" sx={{marginLeft:'30px',marginBotton:'10px'}}> Add Thumbnail</Typography>
              

                    <div class="image-upload">
                <label for="file-input">
                  <Paper  sx={{cursor:'pointer',height:'200px',width:'200px',backgroundRepeat:'no-repeat',backgroundSize: 'contain',backgroundImage:currentPreview?`url(`+currentPreview+`)`:`url('https://www.iconbunny.com/icons/media/catalog/product/3/8/3815.9-insert-image-icon-iconbunny.jpg')`}}/>

                </label>

                <input id="file-input" type="file" accept="image/*"  style={{display:'none'}} onChange={handlePictureChange} />
              </div>
                  
              
                  </Stack>
                  
                 
                </Grid>
                <Grid sx={{display:'flex',justifyContent:'center',alignItems:'center'}}item xs={6}>
                  <Stack>
                    <Typography variant="h6" sx={{marginLeft:'100px',marginBotton:'10px'}}> Add Files</Typography>
                    <FileUploader  handleChange={handleFileChange} name="file" types={fileType}  />
                    <Button sx={{mt:3}} variant="contained" onClick={handleSubmit}>Submit</Button>
              
                  </Stack>
                  
                 
                </Grid>
              </Grid>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </SideBar>
  )
}

export default Marketplace