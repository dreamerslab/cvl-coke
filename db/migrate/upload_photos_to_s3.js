module.exports = {

  modify : function ( Model ){
    var Flow     = require( 'node.flow' );
    var Photo    = Model( 'Photo' );
    var img      = require( LIB_DIR + 'img_processor' );
    var _pub_dir = PUB_DIR.replace( /\/+$/, '' );
    var photos;

    return {

      init : function ( series, parallel, join, end ){
        series( this.all_photos );
        end( this.upload_to_s3 );
      },

      all_photos : function ( next ){
        Photo.find().
          select( 'url1 url2 url3 url4' ).
          exec( function ( err, _photos ){
            if( err ){
              LOG.error( 'fail to query all the photos', err );
              return process.exit( 0 );
            }

            photos = _photos;

            next();
          });
      },

      upload_to_s3 : function ( end ){
        var flow = new Flow();

        photos.forEach( function ( photo ){
          var i    = 1;
          var each = function ( i ){
            return function ( ready ){
              var url = photo[ 'url' + i ];

              if(( i === 4 ) && ( url === '' )) return ready();

              img.s3.create({
                source_path : _pub_dir + url,
                target_path : url,
                headers     : {},
                callback    : function (){
                  ready();
                }
              });
            };
          };

          for( ; i < 5; i++ ){
            flow.parallel( each( i ));
          }
        });

        flow.join().end( function (){
          end();
        });
      }
    };
  }
};