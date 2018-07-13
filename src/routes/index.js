const Router = require("koa-router")

const v1Router = require("./v1")
const router = new Router()

function buildRedirectPath(to) {
  const parts = [ process.env.LATEST_VERSION, "doc" ]
  if(process.env.STAGE !== 'production') {
    parts.unshift(process.env.STAGE)
  }

  return "/" + parts.join("/")
}

function redirectToDoc(ctx, next) {
  ctx.redirect(buildRedirectPath("doc"))
}
router.get("/", redirectToDoc)
router.get("/doc", redirectToDoc)

router.get("/openapi.yaml", (ctx, next) => {
  ctx.redirect(buildRedirectPath("openapi.yaml"))
})

router.use("/v1", v1Router.routes(), v1Router.allowedMethods())

module.exports = router
