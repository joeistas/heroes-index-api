const { getFileChildren } = require("../s3")

module.exports.getVersionProfiles = (ctx, next) => {
  const params = ctx.params
  return getFileChildren(`${ params.realm }/${ params.version }/heroes/`)
    .then(profiles => {
      return profiles.map(profile => {
        const parts = profile.split("/")
        return parts[parts.length - 2]
      })
    })
    .then(profiles => {
      ctx.profiles = profiles
      return next()
    })
}
