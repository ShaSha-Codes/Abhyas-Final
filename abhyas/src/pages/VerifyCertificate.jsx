import React from 'react'
import { useParams } from 'react-router-dom'
import {db} from '../firebase'
import {collection,query,where,getDocs} from 'firebase/firestore'
import '../styles/VerifyCertificate.css'
import Pdf from "react-to-pdf";
import Button from '@mui/material/Button';
import QRCode from "react-qr-code";


const ref = React.createRef();

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
          tempData.push({certificateCredential:doc.data().certificateCredential,title:doc.data().title,logo:doc.data().logo, signature:doc.data().signature, name:doc.data().name, email:doc.data().email, organisation:doc.data().organisation, date:doc.data().date,signer:doc.data().signer})
        })
        console.log(tempData)
        setCertificateData(tempData)
        setLoaded(true)
    }

    const options = {
        orientation: 'landscape',
        unit: 'px',
        format: [900, 660],
      };

    const filename = (props) => {
        return ('Abhyas-certificate-'+props+'.pdf')
    }


    React.useEffect(() => {
        certificateUpdater()
    },[])




  return (
    <div>
        {loaded &&
        <div>
          <Pdf targetRef={ref} options={options} scale={2} filename={filename(certificateData[0].certificateCredential)}>
        {({ toPdf }) => <div style={{display:"flex",justifyContent:"center"}}><Button
              variant="contained"
              sx={{ mt: 1, backgroundColor: '#3c7979'}} onClick={toPdf}>Download Certificate</Button></div>}
      </Pdf>
        <div ref={ref} className="certificate-body">
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
                <p className="signer" style={{marginTop:-1}}>{certificateData[0].signer}</p>
            </div>
            <div className="date">
              Date of completion:
              {dateConverter()  }
            </div>
            <div className="date">
              Email verification:
              {certificateData[0].email}
            </div>
            <div className="qr">
              <p className="qr-text">verify certificate at:</p>
              <QRCode 
                style={{ height: "auto", maxWidth: "80px", width: "100%" }}
                viewBox={`0 0 256 256`} value={window.location.href} />
              </div>
          </div>
        </div>
        <div className="cred">
              Credentials:
              {certificateData[0].certificateCredential}
            </div>
        </div>}
        
  </div>
  )
}
