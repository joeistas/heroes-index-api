const { join } = require("path")
const Router = require("koa-router")
const send = require("koa-send")

const versions = require("./versions")
const { bufferToJsonResponse } = require("../../response")
const { getObjectFromS3, getFileChildren } = require("../../s3")

const DOCS_ROOT = join(__dirname, '../../../docs/v1')
const router = new Router()

router.get("/", (ctx, next) => {
  return getFileChildren("")
    .then(list => {
      ctx.response.body = { realms: list.map(realm => realm.replace("/", "")) }
    })
})

router.get("/openapi.yaml", (ctx, next) => {
  ctx.set('Content-Type', 'application/x-yaml')
  return send(ctx, "openapi.yaml", { root: DOCS_ROOT, gzip: false, brotli: false })
})

router.get("/doc", (ctx, next) => {
  ctx.set('Content-Type', 'text/html')
  return send(ctx, "redoc-static.html", { root: DOCS_ROOT, gzip: false, brotli: false })
})

router.get("/:realm", (ctx, next) => {
  return getObjectFromS3(`${ ctx.params.realm }/versions.json`)
    .then(data => bufferToJsonResponse(ctx, data))
})

router.use("/:realm", versions.routes(), versions.allowedMethods())

module.exports = router
