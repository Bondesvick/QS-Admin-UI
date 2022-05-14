export const parseCustomerRequest = (customerRequest) => ({
  details: customerRequest?.moduleDetails,
  documents: customerRequest?.moduleDocuments?.map((doc) => {
    let contentType = doc.documentContentType || doc.docExtension || doc.documentType || '';
    if (!contentType.includes('/')) {
      switch (doc.docExtension) {
        case 'doc':
          contentType = 'application/vnd.ms-word';
          break;
        case 'docx':
          contentType = 'application/vnd.ms-word';
          break;
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'jpg':
          contentType = 'image/jpeg';
          break;
        case 'svg':
          contentType = 'image/svg+xml';
          break;
        case 'jpeg':
          contentType = 'image/jpeg';
          break;
        case 'png':
          contentType = 'image/png';
          break;
        case 'gif':
          contentType = 'image/gif';
          break;
        default:
          contentType = 'image/jpg';
      }
    }

    return {
      documentName: doc.documentName || doc.fileName || doc.docType || doc.docName,
      documentFile: doc.documentFile || doc.contentOrPath || doc.docContent,
      documentFullName: doc.documentFullName || doc.title || doc.docTitle,
      documentContentType: contentType,
      documentNumber: doc.documentNumber,
    };
  }),
});
