import React from 'react';
import { pdf } from '@react-pdf/renderer';
import ResumeDocument from './ResumeDocument';


 async function generatePdf(cvData) {
 const blob = await pdf(
  React.createElement(ResumeDocument, {
    cv:cvData.cv, photoUrl: cvData.imgUrl
    
  })
).toBlob();

  return Buffer.from(await blob.arrayBuffer());
}

export default generatePdf