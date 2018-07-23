'use strict'

const Downloader = require('filedownloader')
const fileList = require('./file_list.json')

fileList.forEach((file) => {
  new Downloader({
    url: file.url,
    saveto: file.path,
    saveas: file.name,
    deleteIfExists: true
  }).on('progress', function(progress) {
    console.log(progress)
  })
})
