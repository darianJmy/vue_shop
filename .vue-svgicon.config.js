const path = require('path')
const svgFilePaths = ['./assets'].map((v) => path.resolve(v))
const tagName = 'icon'

module.exports = {
  tagName,
  svgFilePath: svgFilePaths,
  svgoConfig: {},
  pathAlias: {},
  transformAssetUrls: {}
}
