const { S3 } =  require("aws-sdk")

const BUCKET_NAME = process.env.S3_BUCKET_NAME
const DELIMITER = process.env.S3_DELIMITER

const s3 = new S3()

module.exports.getObjectResponseFromS3 = function(key) {
  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: BUCKET_NAME,
      Key: key,
    }, (error, data) => {
      if(error) {
        reject(error)
      }
      else {
        resolve(data)
      }
    })
  })
}

module.exports.getObjectFromS3 = function(key) {
  return module.exports.getObjectResponseFromS3(key).then(data => data.Body)
}

module.exports.getFileChildren = function(prefix) {
  return new Promise((resolve, reject) => {
    s3.listObjectsV2({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      Delimiter: DELIMITER,
    }, (error, data) => {
      if(error) {
        reject(error)
      }
      else {
        const list = []
        list.push(...data.Contents.map(file => file.Key))
        list.push(...data.CommonPrefixes.map(prefix => prefix.Prefix))
        resolve(list)
      }
    })
  })
}

module.exports.uploadToS3 = function(key, contentType, fileData) {
  return new Promise((resolve, reject) => {
    s3.upload({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileData,
      ContentType: contentType,
    }, (error, data) => {
      if(error) {
        reject(error)
      }
      else {
        resolve(data)
      }
    })
  })
}
