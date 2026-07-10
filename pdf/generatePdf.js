import React from 'react';
import { pdf } from '@react-pdf/renderer';
import ResumeDocument from './ResumeDocument';
import CoverLetterDocument from './CoverLetterDocument';

 export async function generateResumePdf(cvData) {
 const blob = await pdf(
  React.createElement(ResumeDocument, {
    cv:cvData.cv, photoUrl: cvData.imgUrl
    
  })
).toBlob();

  return Buffer.from(await blob.arrayBuffer());
}

 export async function generateCoverPdf(cvData) {
 const blob = await pdf(
  React.createElement(CoverLetterDocument,cvData)
).toBlob();

  return Buffer.from(await blob.arrayBuffer());
}