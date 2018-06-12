module.exports.bufferToJsonResponse = function(ctx, buffer) {
  ctx.response.body = buffer.toString("utf8")
  ctx.response.type = "application/json"
}

module.exports.s3ResponseToResponse = function(ctx, response) {
  ctx.response.body = data.Body
  ctx.response.type = data.ContentType
  ctx.response.length = data.ContentLength
  ctx.response.set("Last-Modified", data.LastModified.toUTCString())
}
