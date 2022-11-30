const AWS = require("aws-sdk");

exports.uploadToS3 = async (data, filename) => {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.I_AM_USER_KEY,
    secretAccessKey: process.env.I_AM_USER_SECRET,
  });

  console.log(data);
  let params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    ACL: "public-read",
    Body: data,
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("something went wrong");
        reject(err);
      }
      resolve(s3response.Location);
    });
  });
};
