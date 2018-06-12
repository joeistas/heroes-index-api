const Router = require("koa-router")

const heroes = require("./heroes")
const mounts = require("./mounts")
const { bufferToJsonResponse, s3ResponseToResponse } = require("../../response")
const { getObjectFromS3, getObjectResponseFromS3 } = require("../../s3")

const router = new Router()

router.prefix("/:version")

router.get("/", (ctx, next) => {
  const params = ctx.params
  return getObjectFromS3(`${ params.realm }/${ params.version }/index.json`)
    .then(data => bufferToJsonResponse(ctx, data))
})

router.get("/source", (ctx, next) => {
  const params = ctx.params
  return getObjectResponseFromS3(`${ params.realm }/${ params.version }/source.zip`)
    .then(response => s3s3ResponseToResponse(ctx, response))
})

router.get("/assets/:asset*", (ctx, next) => {
  const params = ctx.params
  return getObjectResponseFromS3(`${ params.realm }/${ params.version }/assets/${ params.asset }`)
    .then(response => s3s3ResponseToResponse(ctx, response))
})

router.use("/heroes", heroes.routes(), heroes.allowedMethods())
router.use("/mounts", mounts.routes(), mounts.allowedMethods())

module.exports = router
