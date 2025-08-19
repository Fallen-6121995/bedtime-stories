const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

// Configure AWS S3
// You will need to set up your AWS credentials and region
// For example, you can use environment variables:
// process.env.AWS_ACCESS_KEY_ID
// process.env.AWS_SECRET_ACCESS_KEY
// process.env.AWS_REGION
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadFileToS3 = async (filePath, bucketName, key) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: key, // File name you want to save as in S3
    Body: fileContent,
    ContentType: 'audio/mpeg' // Adjust content type as needed (e.g., audio/wav)
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. ${data.Location}`);
    return { success: true, location: data.Location };
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    return { success: false, error: err.message };
  }
};

module.exports = {
  uploadFileToS3
};
