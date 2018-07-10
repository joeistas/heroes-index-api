const Router = require("koa-router")

const v1Router = require("./v1")
const router = new Router()

function redirectToDoc(ctx, next) {
  ctx.redirect("/" + [ process.env.STAGE, process.env.LATEST_VERSION, "doc" ].join("/"))
}
router.get("/", redirectToDoc)
router.get("/doc", redirectToDoc)

router.get("/openapi.yaml", (ctx, next) => {
  ctx.redirect("/" + [ process.env.STAGE, process.env.LATEST_VERSION, "openapi.yaml" ].join("/"))
})

router.use("/v1", v1Router.routes(), v1Router.allowedMethods())

module.exports = router
