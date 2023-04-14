import React from 'react'
import SideBar from '../components/SideBar'
import { useParams } from 'react-router-dom'
import {useSelector} from 'react-redux'
import {doc,getDoc,getDocs,query,where,collection,setDoc,updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore'
import {db,storage} from '../firebase'
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material'
import { FileUploader } from "react-drag-drop-files";
import  Typography  from '@mui/material/Typography'
import { nanoid } from 'nanoid'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


  const fileType=['pdf','doc','docx','ppt','pptx','xls','xlsx','txt','csv','zip','rar','7z','tar','gz','tar.gz','tar.bz2','tar.xz','tar.lz','tar.lzma','tar.lzo','tar.sz','tar.Z','tar.zst','tar.lz4',
  'tar.lz4','tar.z','mp4','mkv','avi','mov','wmv','flv','mpg','mpeg','webm','ogg','ogv','m4v','3gp','3g2','3gpp','3gpp2','3g','mp3',
  'wav','wma','aac','flac','m4a','m4b','m4p','m4r','m4v','mka','png','jpeg','jpg','gif','bmp','svg','webp','psd','ai','eps','indd','raw','cr2','nef','orf','sr2','tif','tiff','dng','jxr','hdp','wdp','jpm','jpx','heic','ktx','ktx2','jng','svg','ico','icns','bpg','jp2','j2k','jpf','jpx','jpm','mj2','mjp2','jxr','hdp','wdp','avif','heif','heic','heics','heifs','avifs','pdf','doc','docx','ppt','pptx','xls','xlsx','txt','csv','zip','rar','7z','tar','gz','tar.gz','tar.bz2','tar.xz','tar.lz','tar.lzma','tar.lzo','tar.sz','tar.Z','tar.zst','tar.lz4',]
  



const Assignment = () => {
    let {id}=useParams();
    let user=useSelector(state=>state.user.value)
    const [userType,setUserType]=React.useState(null)
    const [teacherData,setTeacherData]=React.useState([])
    const [assignmentData,setAssignmentData]=React.useState([])
    const [content,setContent]=React.useState(null)
    const navigate=useNavigate()
    const handleFileChange=(uploadedFile)=>{
        
        setContent(uploadedFile)
        console.log(uploadedFile)
      
      }
    
      const handleSubmit=async()=>{
        let assignmentId=nanoid(10)
        const storageRef = ref(storage, 'Assignment/' + assignmentId);
        const uploadTask = uploadBytesResumable(storageRef, content);
        uploadTask.on('state_changed',
        (snapshot) => {}, (error) => {console.log(error)}, 
        () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                const dataRef = doc(db, "Assignments", id);

             
                await updateDoc(dataRef, {
                    students: arrayUnion({email:user.email,file:downloadURL,marks:"-"})
                });
            })
    });
    navigate('/Classroom')
  }

    const handleKeyPress=async(e,row)=>{
        if(e.key==='Enter'){
            const dataRef = doc(db, "Assignments", id);
            console.log(row)
            console.log(e.target.value)
            await updateDoc(dataRef, {
                students: arrayRemove({email:row.email,file:row.file,marks:row.marks})
            });

            await updateDoc(dataRef, {
                students: arrayUnion({email:row.email,file:row.file,marks:e.target.value})
            });

            setTeacherData(teacherData.map((item)=>{
                if(item.email===row.email){
                    item.marks=e.target.value
                }
                return item
            }))

        }
    }
 


    React.useEffect(() => {
        const getUserType=async()=>{
            let assignmentRef=doc(db,'Assignments',id)
            let assignmentSnap=await getDoc(assignmentRef)
            let assignData=assignmentSnap.data()
            setAssignmentData(assignData)
            let classRef=doc(db,'Classes',assignData.classCode)
            let classSnap=await getDoc(classRef)
            let classData=classSnap.data()

            if(classData.teacher===user.email){
                setUserType('Teacher')
                let newTeacherDataList=[]
                let tempStudentList=classData.students
                for(let i=0;i<tempStudentList.length;i++){
                    let flag=0
                    for(let j=0;j<assignData.students.length;j++){
                        console.log("testing")
                        if(tempStudentList[i]===assignData.students[j].email){
                           
                            newTeacherDataList.push({id:i+1,email:tempStudentList[i],status:"Submitted",file:assignData.students[j].file,marks:assignData.students[j].marks})
                            flag=1
                        }
                    }
                    if(flag===0){
                        newTeacherDataList.push({id:i+1,email:tempStudentList[i],status:"Not Submitted",file:"-",marks:"-"})
                    }
                    setTeacherData(newTeacherDataList)
                }
               

                }else{
                    setUserType('Student')
                    for(let i=0;i<assignData.students.length;i++){
                        if(assignData.students[i].email===user.email){
                            setContent(assignData.students[i])
                            setUserType('Completed')
                            break
                        }
                    }
                }
        }
        getUserType()
    },[])

   
  return (
    <SideBar>
       {userType==='Teacher' && 
        <div>

    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
            <TableRow>
                <StyledTableCell align="center">Id</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">File</StyledTableCell>
                <StyledTableCell align="center">Marks</StyledTableCell>
             
            </TableRow>
            </TableHead>
            <TableBody>
            {teacherData.map((row) => (
                <StyledTableRow key={row.id}>
                     <StyledTableCell align="center" component="th" scope="row">
                    {row.id}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                    {row.email}
                </StyledTableCell>
                <StyledTableCell align="center">{row.status}</StyledTableCell>
                <StyledTableCell align="center">{row.status==="Submitted"?< a href={row.file}>Click Here</a>:"-"}</StyledTableCell>
                <StyledTableCell align="center">
                    <TextField defaultValue={row.marks} id="filled-basic" label="Marks" variant="filled" onKeyDown={(event)=>handleKeyPress(event,row)} />
                </StyledTableCell>
                   
                </StyledTableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
            </div>
       
       
       }

       {
              userType==='Student' &&
              <div>
                    <Grid container sx={{padding:'120px'}}>
                        <Grid item xs={6}>
                            <h1>Assignment Details</h1>
                            <p>Assignment Name: {assignmentData.title}</p>
                            <p>Assignment Description: {assignmentData.description}</p>

                            <Paper elevation={12} sx={{display:'flex',justifyContent:'center',marginTop:'30px',width:'500px',height:'400px',borderRadius:'20px'}}>
                                <Stack>
                                    <h1>Your Work</h1>
                                  
                                    <Typography variant="h6" sx={{marginLeft:'100px',marginBotton:'10px'}}> Add Files</Typography>
                                        <FileUploader  handleChange={handleFileChange} name="file" types={fileType}  />
                                    <Button sx={{mt:3}} variant="contained" onClick={handleSubmit}>Submit</Button>
                                </Stack>
                            </Paper>
                        </Grid>
                      
                    </Grid>
              </div>
       }


       {
              userType==='Completed' &&
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80vh'}}>
                    <Stack>
                    <Typography variant="h4">You have already submitted your work</Typography>
                   
                    {
                        (content.marks && content.marks!='-') && 
                        <Typography variant="h4">Your Marks: {content.marks}</Typography>
                    }
                    </Stack>

                </div>
       }
    </SideBar>
  )
}

export default Assignment