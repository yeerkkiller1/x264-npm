var fs = require("fs");
var {spawn} = require("child-process-promise");

/** Forces an actual require, making this work if they use webpack. */
function nativeRequire(name) {
    return eval(`require("${name}")`);
}

function getx264Source() {
    //var packageJSON = JSON.parse(fs.readFileSync(__dirname + "/package.json").toString());
    //var x264Sources = Object.keys(packageJSON.optionalDependencies).filter(x => x.startsWith("x264-"));
    // We can't read package.json, because webpack may collapse us, and I don't know how to fix that without adding
    //  ANOTHER package, that wraps this.
    var x264Sources = ["x264-linuxarm", "x264-osx64", "x264-win64"];
    for(let x264Source of x264Sources) {
        try {
            var x264 = nativeRequire(x264Source);
            console.log(`Found x264 at ${x264Source}`);
            return x264;
        } catch(e) {}
    }
    throw new Error(`No x264 sources can be imported. Tried ${x264Sources.join(", ")}`);
}

var x264PathFnc = getx264Source();
var x264Path = x264PathFnc();
async function x264(...args) {
    console.log(`Using x264 path ${x264Path}`);
    try {
        var result = await spawn(x264Path, args, { capture: ["stdout", "stderr"] });
        return result.stdout.toString();
    } catch (e) {
        if(!e.stderr) throw e;
        throw e.stderr.toString();
    }
};

module.exports = {
    x264: x264
};