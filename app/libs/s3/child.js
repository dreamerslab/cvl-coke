// Docs : https://github.com/SaltwaterC/aws2js/wiki/S3-Client
var aws      = require( 'aws2js' );
var life_sec = 3600 * 24 * 365 * 10; //ten years

process.on( 'message', function ( msg ){
  var config = msg.config;
  var s3     = aws.load( 's3', config.key, config.secret );

  var methods = {
    create : function ( args ){
      var date = new Date();

      date.setUTCFullYear( date.getUTCFullYear() + 10 );

      var expires = date.toUTCString();
      var headers = {
        'Cache-Control' : 'max-age=' + life_sec + ', public',
        'Expires'       : expires
      };

      s3.putFile( args.target_path, args.source_path, 'public-read', headers,
        function ( err, result ){
          process.send({
            result : result,
            err    : err
          });
          process.exit();
        });
    },

    destroy : function ( args ){
      s3.del( args.target_path, function ( err, result ){
        process.send({
          done : true,
          err  : err
        });
        process.exit();
      });
    }
  };

  s3.setBucket( config.s3.bucket );
  methods[ msg.method ]( msg );
});
