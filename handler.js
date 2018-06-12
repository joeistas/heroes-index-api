'use strict';

const serverless = require('serverless-http');

const app = require("./src/app")
const updateVersionList = require("./src/version-list")

module.exports.api = serverless(app)
module.exports.updateVersionList = updateVersionList
