const { getFileChildren, getObjectFromS3, uploadToS3 } = require("./s3")

const VERSIONS_FILE_NAME = process.env.VERSIONS_FILE_NAME
const VERSION_INDEX_FILE_NAME = process.env.VERSION_INDEX_FILE_NAME

module.exports = function(event, context, callback) {
  const key = event.Records[0].s3.object.key
  const realm = key.split("/")[0]

  getFileChildren(`${ realm }/`)
    .then(versions => {
      return Promise.all(versions.filter(version => !version.endsWith(VERSIONS_FILE_NAME)).map(version => {
        return getObjectFromS3(version + VERSION_INDEX_FILE_NAME)
          .then(data => JSON.parse(data.toString("utf8")))
        })
      )
    })
    .then(versionData => {
      return versionData.map(version => {
        delete version.heroes
        delete version.mounts
        return version
      })
    })
    .then(versionData => { return JSON.stringify({ versions: versionData }) })
    .then(data => uploadToS3(`${ realm }/${ VERSIONS_FILE_NAME }`, "application/json", data))
    .then(data => callback(null, "updated"))
    .catch(error => callback(error))
}
