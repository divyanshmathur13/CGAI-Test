import React from 'react';
import previewArrow from '../../../../assets/icons/arrow-preview.svg';
import './AnalyserHeader.scss';
import reset from '../../../../assets/icons/reset.svg';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
function AnalyserHeader({ onReset }: { onReset: () => void }) {
 // Get projectId from Redux store
 const projectId = useSelector((state: any) => state.queryParams.projectId);


 const resetData = async () => {
   try {
     // Perform API call to delete data
     const response = await fetch(
       `${process.env.REACT_APP_BACKEND_SERVICE_URL}projects/data-sources/all-delete/${projectId}/`,
       {
         method: 'DELETE',
         headers: {
           'user-agent': '', // Add any additional headers if needed
           'Content-Type': 'application/json',
         },
       }
     );


     if (!response.ok) {
       throw new Error('Network response was not ok');
     }


     if(response)
     {
       toast.success('Data Deleted Successfully ',{duration:1000})
     }


     // You can do something with the formattedData here (e.g., update state, etc.)


   } catch (error: any) {
     if (error.name === 'AbortError') {
       console.log('Fetch request aborted');
     } else {
       console.error('Error fetching AI response:', error);
     }
   }
 };


 return (
   <div className="header-bar d-flex just-space">
     <Toaster position="top-center" reverseOrder={false} />
     <div className='d-flex gap-16'>
       <div className="left-section d-flex center-align">
         <img className='pointer-cursor' src={previewArrow} alt="" />
       </div>
       <div className="middle-section d-flex flex-dir-col gap-8">
         <div className="title">Analyzing Details by vertex ...</div>
         <div className="status">Processing Files</div>
       </div>
     </div>


     <div className='d-flex gap-8'>
       <div onClick={onReset} className="reset-btn-2">
         <img src={reset} alt="" />
         <span className="h7">Refresh</span>
       </div>
       <div className="right-section">
         <button onClick={resetData} className="cancel-button">Reset</button>
       </div>
     </div>
   </div>
 );
}


export default AnalyserHeader;
