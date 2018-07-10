const Router = require("koa-router")

const { getVersionProfiles } = require("../../../middleware/profiles")
const { bufferToJsonResponse } = require("../../../response")
const { getObjectFromS3, getFileChildren } = require("../../../s3")

const router = new Router()

function getMountsForVersion(ctx, next) {
  const params = ctx.params
  return getObjectFromS3(`${ params.realm }/${ params.version }/index.json`)
    .then(data => {
      ctx.mounts = JSON.parse(data.toString("utf8")).mounts
      return next()
    })
}

function buildMountKey(realm, version, profile, mount) {
  return `${ realm }/${ version }/mounts/${ profile }/${ mount.toLowerCase() }.json`
}

router.get("/",
  getMountsForVersion,
  getVersionProfiles,
  ctx => {
    ctx.body = {
      profiles: ctx.profiles,
      mounts: ctx.mounts
    }
  }
)

router.get("/:mount", ctx => {
  const params = ctx.params
  return getObjectFromS3(buildMountKey(params.realm, params.version, "basic", params.mount))
    .then(data => bufferToJsonResponse(ctx, data))
})

router.get("/:mount/:profile", ctx => {
  const params = ctx.params
  return getObjectFromS3(buildMountKey(params.realm, params.version, params.profile, params.mount))
    .then(data => bufferToJsonResponse(ctx, data))
})

module.exports = router
