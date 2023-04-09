import React from 'react'
import { useParams } from 'react-router-dom'
import {db} from '../firebase'
import {collection,query,where,getDocs} from 'firebase/firestore'
import '../styles/VerifyCertificate.css'

export default function VerifyCertificate() {
    const {certificateCredential}=useParams()
    const [certificateData, setCertificateData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);

    const dateConverter=()=>{
        var d = new Date(certificateData[0].date);
        return d.toDateString();
    }
        
    const certificateUpdater=async()=>{
        const q = query(collection(db, "Certificates"), where("certificateCredential", "==", certificateCredential ));
        const querySnapshot = await getDocs(q);
        let tempData=[]
        querySnapshot.forEach((doc) => {
          tempData.push({certificateCredential:doc.data().certificateCredential,title:doc.data().title,logo:doc.data().logo, signature:doc.data().signature, name:doc.data().name, email:doc.data().email, organisation:doc.data().organisation, date:doc.data().date})
        })
        console.log(tempData)
        setCertificateData(tempData)
        setLoaded(true)
    }
    React.useEffect(() => {
        certificateUpdater()
    },[])




  return (
    <div>
        {loaded &&
        <div className="certificate-body">
        <div className="certificateContainer shadow-lg ">
            <div className="logo">
              <img
                className="logoimg"
                src={certificateData[0].logo}
              />
              <br />
                {certificateData[0].organisation}
            </div>

            <div className="heading">Certificate of Completion</div>

            <div className="presented">This certificate is presented to</div>

            <div className="person">
              {certificateData[0].name}
            </div>

            <div className="reason">
              For the succesful completion of: <br />
              {certificateData[0].title}
            </div>
            <div className="signature">
                <img
                className="signatureimg"
                src={certificateData[0].signature}
                />
            </div>
            <div className="date">
              Date of completion:
              {dateConverter()  }
            </div>
            <div className="date">
              Email verification:
              {certificateData[0].email}
            </div>
            <div className="cred">
              Credentials:
              {certificateData[0].certificateCredential}
            </div>
          </div>
        </div>}
        
  </div>
  )
}
