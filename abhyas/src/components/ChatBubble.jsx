import React from 'react'
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import { useSelector } from 'react-redux';
import {doc,getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import { Typography } from '@mui/material';
const FileContent=({content,file,name})=>{


    const onButtonClick = (file,name) => {
        // using Java Script method to get PDF file
        fetch(file).then(response => {
            response.blob().then(blob => {
                // Creating new object of PDF file
                const fileURL = window.URL.createObjectURL(blob);
                // Setting various property values
                let alink = document.createElement('a');
                alink.href = fileURL;
                alink.download = name;
                alink.click();
            })
        })
    }


    return(
        <div style={{margin:0,padding:0}}>
            {
                content.includes('image') && <img src={file} style={{width:'300px'}} alt=""/> ||
                content.includes('video') && <video src={file} style={{width:'300px'}} controls/> ||
                content.includes('audio') && <audio src={file} style={{width:'300px'}} controls/> ||
                content.includes('message') && <p>{file}</p> ||
                <p> 
                    {name}
                    <IconButton aria-label="delete">
                        <DownloadIcon onClick={()=>{onButtonClick(file,name)}}/>
                    </IconButton>
                    
                </p>
            }
        </div>
    )
}




const ChatBubble = (props) => {
    const user = useSelector(state => state.user.value)
    const [sender,setSender]=React.useState({})
    const [color,setColor]=React.useState('green')

    React.useEffect(()=>{
        const docRef=doc(db,'UserInfo',props.sender)
        const getSender=async()=>{
            const docSnap=await getDoc(docRef)
            if(docSnap.exists()){
                setSender(docSnap.data())
                const asciiCode1 = docSnap.data().email.charCodeAt(0);
                const asciiCode2 = docSnap.data().email.charCodeAt(2)?docSnap.data().email.charCodeAt(2):docSnap.data().email.charCodeAt(1);
                const asciiCode3 = docSnap.data().email.charCodeAt(8)?docSnap.data().email.charCodeAt(8):docSnap.data().email.charCodeAt(2);
                const colorNum = asciiCode1.toString() + asciiCode2.toString() + asciiCode3.toString();
                var num = Math.round(0xffffff * parseInt(colorNum));
                var r = num >> 5 & 125;
                var g = num >> 8 & 125;
                var b = num & 125;
                setColor('rgb(' + r + ', ' + g + ', ' + b + ')' )   
            }
           
        }
        
        getSender()

       

    
    },[])

   


  return (
    <div>
        {props.user === 1 ?
         <Alert 
            sx={{wordBreak: 'break-all',display:'flex',justifyContent:'space-between',alignItems:'center',width:'fit-content',margin:'10px',padding:'10px',borderRadius:'20px',backgroundColor:'#f5f5f5',color:'black'}}
            icon={<Avatar alt="User" src={user.photoUrl}/>} 
            severity="info">
                {<FileContent content={props.type} file={props.type==="message"?props.message:props.file} name={props.name}/>}         
        </Alert>
        :
        <Alert 
            sx={{display:'flex',marginRight: 'auto',
            float:'right',justifyContent:'space-between',alignItems:'center',width:'fit-content',margin:'10px',padding:'10px',borderRadius:'20px',backgroundColor:'#b7d7d7',color:'black'}}
            icon={false} 
            severity="info">
                <Stack direction="row"  sx={{wordBreak: 'break-all',display:'flex',justifyContent:'space-between',alignItems:'center',width:'fit-content',borderRadius:'20px'}} >
                <Stack direction="column"  sx={{wordBreak: 'break-all',display:'flex',alignItems:'flex-start',width:'fit-content',borderRadius:'20px'}} >
                    <Typography color={color} variant='h7'><strong>{sender?.email}</strong></Typography>
                    {<FileContent content={props.type} file={props.type==="message"?props.message:props.file} name={props.name}/>}  
                </Stack>
                        <Avatar sx={{marginLeft:"12px"}} alt="User" src={sender?.photoUrl} />
                </Stack>
        </Alert>    
        }

    </div>
  )
}

export default ChatBubble