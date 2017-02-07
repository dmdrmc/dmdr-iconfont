var fs                = require('fs')
var path              = require('path')
var glob              = require('glob')
var webfontsGenerator = require('webfonts-generator')
var Handlebars        = require('handlebars')
var pkg               = require('../package.json')

console.log('pkg:'+pkg.name);

Handlebars.registerHelper('strip_hashtag', function(src) {
  var res = src.replace(/(\?[a-z0-9\#]*)/g ,"");
  //console.log('transforming src: '+src+' to: '+res);
  return new Handlebars.SafeString(res);
});

/* name of font to be used for everything */
var fontName  = pkg.name;
var destinationFolder = ''

/* source folder of all icons */
var source    = "./icons/*.svg"

/* destination folder for all iconfont related files */
var dest      = path.join(__dirname, '..', 'build');

/* gather all icons from source folder */
glob(source,function(err,files) {  
  if(err) {
    console.log("Error!",err)
  } else {
    createIconFont(fontName,files);
  }
});

/* method to create a iconfont */
function createIconFont(fontName,files) {

  // https://github.com/sunflowerdeath/webfonts-generator#options

  var OPTIONS = {
    html:  true,
    htmlTemplate: path.join(__dirname, 'templates', 'html.hbs'),
  	dest: path.join(dest,fontName),
  	files: files,
    embed: false,
  	fontName: fontName,
    cssDest: path.join(dest,fontName,fontName+'.css'),    
    cssTemplate: path.join(__dirname,'templates','css.hbs'),    
  }

  webfontsGenerator(OPTIONS, function(error) {
  	if (error) console.log('Fail!', error)
  	else console.log('preview Done!')
  })


  var OPTIONS = {
    html:  false,
  	dest: path.join(dest,fontName),
  	files: files,
    embed: false,
  	fontName: fontName,
    cssFontsUrl: "fonts/"+fontName+"/",
    cssDest: path.join(dest,fontName+"/"+fontName+'.scss'),    
    cssTemplate: path.join(__dirname,'templates','scss.hbs'),    
  }

  webfontsGenerator(OPTIONS, function(error) {
  	if (error) console.log('Fail!', error)
  	else console.log('iconfont Done!')
  })
  
}
