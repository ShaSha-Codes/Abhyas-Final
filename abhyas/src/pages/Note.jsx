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
import useLogout from '../hooks/useLogout';

const Note = () => {
    const {noteCode} = useParams()
    const [note,setNote] = React.useState('')
    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
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
        <Grid container 

  alignItems="center"
  justifyContent="center"
  spacing={2} >
     
                    <Grid xs={6}>
                    <Paper sx={{ml:25,minHeight:'300px',p:5,width:'500px',borderRadius:'10px'}} elevation={12} >
                        <Typography variant="h5" component="h1" gutterBottom>
                                Title:
                            </Typography>
                            <Typography variant="h6" component="h2" gutterBottom>
                                {note?.title}
                            </Typography>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Descrption:
                            </Typography>
                            <Typography variant="h6" component="h3" gutterBottom>
                                {note?.description}
                            </Typography>
                            </Paper>
                    </Grid>
                    <Grid xs={6}>
                            <Paper sx={{width:'700px',borderRadius:'10px'}} elevation={12} >
                                    <Stack spacing={0} alignItems={'center'}>
                                        <Document  file={note?.file} onLoadError={console.error} onLoadSuccess={onDocumentLoadSuccess}>
                                            <Page height='800' pageNumber={pageNumber} />
                                        </Document>
                                        <p style={{margin:'0px'}}>
                                            Page {pageNumber} of {numPages}
                                        </p>
                                        <Stack justifyContent="center"direction={'row'}>
                                            <IconButton onClick={onButtonClick}>
                                           
                                                <DownloadIcon />
                                            
                                            </IconButton>
                                            <IconButton onClick={leftClickHandler}>
                                                <ArrowCircleLeftIcon />
                                            </IconButton>
                                            <IconButton onClick={rightClickHandler}>
                                                <ArrowCircleRightIcon />
                                            </IconButton>
                                        </Stack>
                                        
                                        
                                    </Stack>
                                
                                    
                            </Paper >
                    
                        
                    </Grid>
            </Grid>
       
        
       
  
    </SideBar>
  )
}

export default Note