import React from 'react'
import SideBar from '../components/SideBar'
import { useParams } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc,setDoc,updateDoc,arrayUnion, arrayRemove  } from "firebase/firestore";
import Fab from '@mui/material/Fab';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import PaidIcon from '@mui/icons-material/Paid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector,useDispatch } from 'react-redux';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { login } from '../features/user';
const MarketplaceNotes = () => {
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
                <DocViewer style={{height:'100vh',width:'100vw'}}documents={[{uri:noteData.content}]} pluginRenderers={DocViewerRenderers} />
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


            <Fab size="medium" color="secondary" aria-label="add" sx={{position:'fixed',right:'30px',bottom:'30px'}}>
                <PaidIcon />
            </Fab>
   
    </SideBar>
  )
}

export default MarketplaceNotes