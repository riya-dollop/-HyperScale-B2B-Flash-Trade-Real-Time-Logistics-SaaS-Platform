const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const region = process.env.AWS_REGION || 'ap-south-1';
const bucketName = process.env.AWS_S3_BUCKET_NAME || 'hyperscale-saas-media';

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret'
  }
});

// Ensure local uploads directory exists for fallback
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Upload buffer or file to AWS S3, fallback to local static serving if mock credentials
 */
const uploadToS3 = async (fileBuffer, fileName, mimeType = 'image/jpeg') => {
  const isMock = !process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID.includes('mock');

  if (isMock) {
    // Save to local disk for development preview
    const localFilePath = path.join(uploadDir, fileName);
    fs.writeFileSync(localFilePath, fileBuffer);
    const localUrl = `/uploads/${fileName}`;
    return {
      success: true,
      url: localUrl,
      bucket: 'local-disk',
      key: fileName
    };
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read'
    });

    await s3Client.send(command);
    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    return {
      success: true,
      url: s3Url,
      bucket: bucketName,
      key: fileName
    };
  } catch (error) {
    console.warn(`[S3 Upload Warning]: ${error.message}. Storing locally.`);
    const localFilePath = path.join(uploadDir, fileName);
    fs.writeFileSync(localFilePath, fileBuffer);
    return {
      success: true,
      url: `/uploads/${fileName}`,
      bucket: 'local-disk',
      key: fileName
    };
  }
};

module.exports = {
  s3Client,
  uploadToS3,
  bucketName
};

