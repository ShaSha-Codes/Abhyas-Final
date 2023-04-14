import React from 'react'
import SideBar from '../components/SideBar'
import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import { useParams } from 'react-router-dom';
import {doc,getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import '../global.css'
import IconButton from '@mui/material/IconButton';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import useLogout from '../hooks/useLogout';

const Note = () => {
    const {noteCode} = useParams()
    const [note,setNote] = React.useState('')
    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [pageScale, setPageScale] = React.useState(1);
    const checker=useLogout()

    React.useEffect(()=>{
        checker("Notes",noteCode)
    },[])

    
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
        fetch(note.file).then(response => {
            response.blob().then(blob => {
                // Creating new object of PDF file
                const fileURL = window.URL.createObjectURL(blob);
                // Setting various property values
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = note.title;
                alink.click();
            })
        })
    }

    React.useEffect(() => {
        (async ()=>{
        const docRef= doc(db,'Notes',noteCode)
        const docSnap=await getDoc(docRef)
        if(docSnap.exists()){
            let tempData=docSnap.data()
            console.log(tempData)
            setNote(docSnap.data())
        }else{
            setNote('')
        }
        })()

    },[])


    console.log(note)
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  
  return (
    <SideBar>
        <Grid xs={6}>
                    <Paper sx={{p:1,width:'100%', bgcolor:"#f9f9f9",borderRadius:0}} elevation={0} >
                            <Typography variant="h6" component="h2" gutterBottom>
                                {note?.title}
                            </Typography>
                            </Paper>
                    </Grid>
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
                                    <Stack spacing={0} alignItems={'center'}>
                                        <Document file={note?.file} onLoadError={console.error} onLoadSuccess={onDocumentLoadSuccess}>
                                            <Page scale={pageScale} height='800' pageNumber={pageNumber} />
                                        </Document>
                                    </Stack>
                    </Grid>
            </Grid>
       
        
       
  
    </SideBar>
  )
}

export default Note