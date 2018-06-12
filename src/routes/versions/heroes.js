const Router = require("koa-router")

const { getVersionProfiles } = require("../../middleware/profiles")
const { bufferToJsonResponse } = require("../../response")
const { getObjectFromS3, getFileChildren } = require("../../s3")

const router = new Router()

function getHeroesForVersion(ctx, next) {
  const params = ctx.params
  return getObjectFromS3(`${ params.realm }/${ params.version }/index.json`)
    .then(data => {
      ctx.heroes = JSON.parse(data.toString("utf8")).heroes
      return next()
    })
}

function buildHeroKey(realm, version, profile, hero) {
  return `${ realm }/${ version }/heroes/${ profile }/${ hero.toLowerCase() }.json`
}

router.get("/",
  getHeroesForVersion,
  getVersionProfiles,
  ctx => {
    ctx.body = {
      profiles: ctx.profiles,
      heroes: ctx.heroes
    }
  }
)

router.get("/:hero", ctx => {
  const params = ctx.params
  return getObjectFromS3(buildHeroKey(params.realm, params.version, "basic", params.hero))
    .then(data => bufferToJsonResponse(ctx, data))
})

router.get("/:hero/:profile", ctx => {
  const params = ctx.params
  return getObjectFromS3(buildHeroKey(params.realm, params.version, params.profile, params.hero))
    .then(data => bufferToJsonResponse(ctx, data))
})

module.exports = router
