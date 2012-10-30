module.exports = {

  modify : function ( Model ){
    var fs       = require( 'fs' );
    var img      = require( LIB_DIR + 'img_processor' );
    var _pub_dir = PUB_DIR.replace( /\/+$/, '' );

    return {

      init : function ( series, parallel, join, end ){
        end( this.get_banner_and_upload_to_s3 );
      },

      get_banner_and_upload_to_s3 : function ( end ){
        var banner_path = BASE_DIR + 'db/banner.json';

        fs.readFile( banner_path, function ( err, banner_json ){
          var banner = JSON.parse( banner_json );

          img.s3.create({
            source_path : _pub_dir + banner,
            target_path : banner,
            headers     : {},
            callback    : function (){
              end();
            }
          });
        });
      }
    };
  }
};