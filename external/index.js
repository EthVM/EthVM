var Downloader = require("filedownloader");
var path = require('path');
var os = require('os');
var fileList = require("./file_list.json");
fileList.forEach((_file, _idx) => {
    var Dl = new Downloader({
        url: _file.url,
        saveto: _file.path,
        saveas: _file.name,
        deleteIfExists: true
    }).on("progress", function(progress) {
        console.log(progress);
    });
})