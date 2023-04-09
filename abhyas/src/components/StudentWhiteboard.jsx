import React from 'react'
import Carousel from 'react-material-ui-carousel'
import {useParams} from 'react-router-dom'
import {getDoc,doc,collection,onSnapshot} from 'firebase/firestore'
import {db} from '../firebase'



const StudentWhiteboard = () => {


    
    const {classCode}=useParams()
    const [carouselData, setCarouselData] = React.useState([])

    React.useEffect(() => {
        const getWhiteboard=async()=>{  
          let tempData=[]
          for(let i=0;i<5;i++){
            const docRef=doc(db,'Whiteboard',classCode,"photo",String(i))
            const docSnap=await getDoc(docRef)
            if(docSnap.exists()){
              tempData.push(docSnap.data().image)
            }
    
          }
          setCarouselData(tempData)

        }
        const interval=setInterval(()=>{
            getWhiteboard()
            }
            ,1000)
        return () => clearInterval(interval);
        
      })
      console.log(carouselData)


  return (
    <Carousel swipe={false} autoPlay={false}>
        {
            carouselData.map((item, i) => <img src={item} alt=""/>)
        }
    </Carousel>

  )
}

export default StudentWhiteboard