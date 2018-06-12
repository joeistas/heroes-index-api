const Koa = require("koa")
const cors = require("@koa/cors")
const logger = require("koa-logger")
const router = require("./routes")

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    error.status = error.statusCode || error.status || 500;
    throw error
  }
})

app.use(logger())
app.use(cors())

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
