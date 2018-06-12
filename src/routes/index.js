const Router = require("koa-router")

const versions = require("./versions")
const { bufferToJsonResponse } = require("../response")
const { getObjectFromS3, getFileChildren } = require("../s3")

const router = new Router()

router.get("/", (ctx, next) => {
  return getFileChildren("")
    .then(list => {
      ctx.response.body = { realms: list.map(realm => realm.replace("/", "")) }
    })
})

router.get("/:realm", (ctx, next) => {
  return getObjectFromS3(`${ ctx.params.realm }/versions.json`)
    .then(data => bufferToJsonResponse(ctx, data))
})

router.use("/:realm", versions.routes(), versions.allowedMethods())

module.exports = router
