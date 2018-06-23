const Router = require("koa-router")

const heroes = require("./heroes")
const mounts = require("./mounts")
const { bufferToJsonResponse } = require("../../response")
const { getObjectFromS3 } = require("../../s3")

const router = new Router()

router.prefix("/:version")

router.get("/", (ctx, next) => {
  const params = ctx.params
  return getObjectFromS3(`${ params.realm }/${ params.version }/index.json`)
    .then(data => bufferToJsonResponse(ctx, data))
})

router.use("/heroes", heroes.routes(), heroes.allowedMethods())
router.use("/mounts", mounts.routes(), mounts.allowedMethods())

module.exports = router
