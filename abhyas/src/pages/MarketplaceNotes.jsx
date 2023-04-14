import React from 'react'
import SideBar from '../components/SideBar'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc,setDoc,updateDoc,arrayUnion, arrayRemove  } from "firebase/firestore";
import Fab from '@mui/material/Fab';
import PaidIcon from '@mui/icons-material/Paid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector,useDispatch } from 'react-redux';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { login } from '../features/user';
import Paper from '@mui/material/Paper';
import { Stack,Grid,Typography,IconButton } from '@mui/material';
import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useNavigate } from 'react-router-dom';
import { WindowSharp } from '@mui/icons-material';

const MarketplaceNotes = () => {
    const [pageNumber, setPageNumber] = React.useState(1);
    const [pageScale, setPageScale] = React.useState(1);
    const [numPages, setNumPages] = React.useState(null);
    const navigate=useNavigate()

    const leftClickHandler=()=>{
        if(pageNumber>1){
            setPageNumber(prevPageNumber=>prevPageNumber-1)
        }
    }

    const rightClickHandler=()=>{
        if(pageNumber<numPages){
            setPageNumber(prevPageNumber=>prevPageNumber+1)
        }
    }

    const onButtonClick = () => {
        // using Java Script method to get PDF file
        fetch(noteData.content).then(response => {
            response.blob().then(blob => {
                // Creating new object of PDF file
                const fileURL = window.URL.createObjectURL(blob);
                // Setting various property values
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = noteData.title;
                alink.click();
            })
        })
    }

    let { id } = useParams();
    const [noteData, setNoteData] = React.useState({})
    let user = useSelector(state => state.user.value)
    const dispatch = useDispatch();
    React.useEffect(() => {
        const getNoteData = async () => {
            const docRef = doc(db, "Marketplace", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setNoteData(docSnap.data())
            } 
        }
        getNoteData()
    }, [])
    console.log(noteData.fileType)


    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
      }

    const handleFavourites=async()=>{
        const docRef = doc(db, "UserInfo", user.email);
        updateDoc(docRef, {
            favourites: arrayUnion(id)
        });
        const docSnap=await getDoc(docRef)

        dispatch(login(docSnap.data()))

    }

    const handlePaid=()=>{
    }

    const handleDislike=async ()=>{
        const docRef = doc(db, "UserInfo", user.email);
        updateDoc(docRef, {
            favourites: arrayRemove(id)
        });
        const docSnap=await getDoc(docRef)

        dispatch(login(docSnap.data()))
    }


  return (
    <SideBar>
    

      
        {noteData && (

            <div>
                <h1>{noteData.title}</h1>
                <p>{noteData.description}</p>
                {(noteData?.fileType?.includes('pdf') || noteData?.fileType?.includes('docx')  || noteData?.fileType?.includes('pptx')) && 
                    




            <Grid container>
                   
                    <Grid xs={6}>
                    <Paper sx={{p:0,width:'100%', bgcolor:"white",borderRadius:0}} elevation={2} >
                    <Stack direction={'row'} spacing={2}>
                                            <IconButton onClick={onButtonClick}>
                                           
                                                <DownloadIcon />
                                            
                                            </IconButton>
                                            <IconButton onClick={leftClickHandler}>
                                                <ArrowCircleLeftIcon />
                                            </IconButton>
                                            <div style={{display:"flex", alignItems:"center"}}>{pageNumber} / {numPages}</div>
                                            <IconButton onClick={rightClickHandler}>
                                                <ArrowCircleRightIcon />
                                            </IconButton>
                                            <IconButton onClick={()=>setPageScale(prevPageScale=>prevPageScale+0.25)}>
                                                <ZoomInIcon />
                                            </IconButton>
                                            <div style={{display:"flex", alignItems:"center",marginLeft:0,marginRight:0}}>
                                            <Typography color="text.secondary" variant="body2" component="div" gutterBottom>
                                                {parseInt(pageScale*100)}%
                                            </Typography>
                                            </div>
                                            <IconButton style={{marginLeft:0}} onClick={()=>setPageScale(prevPageScale=>prevPageScale-0.25)}>
                                                <ZoomOutIcon/>
                                            </IconButton>
                                        </Stack>
                            </Paper>
                    </Grid>
        <Grid container 
        sx={{bgcolor:'#e4e4e4',pt:'10px',pb:'10px'}}
        alignItems="center"
         justifyContent="center"
         spacing={0} >
     
                    <Grid xs={6}>
                            <Paper sx={{width:'700px',borderRadius:'10px'}} elevation={12} >
                                    <Stack spacing={0} alignItems={'center'}>
                                        <Document  file={noteData.content} onLoadError={console.error} onLoadSuccess={onDocumentLoadSuccess}>
                                            <Page scale={pageScale} height='800' pageNumber={pageNumber} />
                                        </Document>
                                    </Stack>
                                
                    
                            </Paper >
                    
                        
                    </Grid>
            </Grid>
            </Grid>
        















                }
                {noteData?.fileType?.includes('image/') &&
                    <img src={noteData.content} alt="note" />
                }
                {noteData?.fileType?.includes('video') &&
                    <video  controls>
                        <source src={noteData.content} type="video/mp4"/>
                
                        Your browser does not support the video tag.
                    </video>     
                    }

            </div>


        )}
            <Fab size="medium" color="primary" aria-label="add" sx={{position:'fixed',right:'30px',top:'100px'}} onClick={handleFavourites}>
                <FavoriteIcon />
            </Fab>

            <Fab size="medium" color="error" aria-label="add" sx={{position:'fixed',right:'30px',top:'180px'}} onClick={handleDislike}>
                <ThumbDownIcon />
            </Fab>


            <Fab size="medium" color="secondary" aria-label="add" sx={{position:'fixed',right:'30px',bottom:'30px'}} onClick={()=>window.location.href="https://buy.stripe.com/test_fZeeVnfo01PZeIwcMN"}>
                <PaidIcon />
            </Fab>

    </SideBar>
  )
}

export default MarketplaceNotes