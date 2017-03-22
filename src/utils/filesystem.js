const fs = require('fs');

let rmdir = dirPath => {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + '/' + files[i];
        if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
        else rmdir(filePath);
    }
    fs.rmdirSync(dirPath);
};

let countFiles = dirPath => {   
        let files = fs.readdirSync(dirPath); 
        return files.length;    
};

module.exports = {
    rmdir,
    countFiles
}
