var Class  = require( 'node.class' );
var fs     = require( 'fs' );
var banner = BASE_DIR + 'db/banner.json';
var lang   = require( LANG_DIR + 'en_us/contact' );

module.exports = Class.extend({

  index : function ( req, res, next ){
    fs.readFile( banner, function ( err, data ){
      if( err ) return next();

      var keywords = [
        'Coverline',
        'homepage'
      ].join( ', ' );

      res.render( 'home/index', {
        title       : 'Coverline Production Agency',
        banner      : JSON.parse( data ),
        keywords    : keywords,
        description : lang.heading.default
      });
    });
  }
});