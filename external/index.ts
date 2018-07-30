import Downloader from 'filedownloader'

import tokens from './file_list.json'

tokens.forEach(token => {
  new Downloader({
    url: token.url,
    saveto: token.path,
    saveas: token.name,
    deleteIfExists: true
  }).on('progress', function(progress) {
    console.log(progress)
  })
})
