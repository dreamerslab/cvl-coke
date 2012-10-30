var fs   = require( 'fs' );
var gm   = require( 'gm' );
var im   = gm.subClass({ imageMagick : true });
var Flow = require( 'node.flow' );

module.exports = {

  s3 : require( './s3' ),

  check_size : function ( path, callback ){
    im( path ).size( callback );
  },

  upload_photos : function ( args, callback ){
    var self   = this;
    var prefix = 'img/photos/' + args.album_name + '-';
    var flow   = new Flow();
    var photos = args.photos;
    var out    = {};

    if( !photos.length ) return callback( out );

    photos.forEach( function ( photo ){
      flow.parallel( function ( ready ){
        var index       = photo.key_name.match( /\d+$/ )[ 0 ];
        var target_path = prefix + UTILS.uid( 5 ) + photo.format;

        out[ 'url' + index ] = '/' + target_path;

        self.s3.create({
          source_path : photo.path,
          target_path : target_path,
          hearders    : {},
          callback    : function( err ){
            var msg = '[img_processor][upload_photos] ';

            !err ?
              LOG.debug( msg + 's3.create success', target_path ) :
              LOG.error( msg + 's3.create error', {
                'error msg'   : err,
                'source_path' : photo.path,
                'target_path' : target_path
              });

            ready();
          }
        });
      });
    });

    flow.join().end( function (){
      callback( out );
    });
  },

  remove_photos : function ( args ){
    var self          = this;
    var current_photo = args.current_photo;
    var photos        = args.photos;

    photos.forEach( function ( photo ){
      var key_num     = photo.key_name.match( /\d+$/ )[ 0 ];
      var target_path = current_photo[ 'url' + key_num ];

      if( !target_path ) return;

      self.s3.destroy({
        target_path : target_path,
        callback    : function ( err ){
          var msg = '[img_processor][remove_photos] ';

          !err ?
            LOG.debug( msg + 's3.destroy success', target_path ) :
            LOG.error( msg + 's3.destroy error', {
              'error msg'   : err,
              'target_path' : target_path
            });
        }
      });
    });
  },

  upload_videos : function ( args, callback ){
    var self    = this;
    var img_url = 'img/film/covers/cover-' + UTILS.uid( 5 ) + '.jpg';
    var prefix  = 'videos/film-';
    var flow    = new Flow();
    var cover   = args.cover;
    var videos  = args.videos;
    var out     = {};

    flow.parallel( function ( ready ){
      if( !cover ) return ready();

      out.cover = '/' + img_url;

      self.s3.create({
        source_path : cover.path,
        target_path : img_url,
        hearders    : {},
        callback    : function ( err ){
          var msg = '[img_processor][upload_videos](cover) ';

          !err ?
            LOG.debug( msg + 's3.create success', img_url ) :
            LOG.error( msg + 's3.create error', {
              'error msg'   : err,
              'source_path' : cover.path,
              'target_path' : img_url
            });

          ready();
        }
      });
    });

    if( videos.length ){
      videos.forEach( function ( video ){
        flow.parallel( function ( ready ){
          if( video.key_name == 'cover' ) return ready();

          var index = video.key_name.match( /\d+$/ )[ 0 ];
          var url   = prefix + UTILS.uid( 5 ) + video.format;

          out[ 'url' + index ] = '/' + url;

          self.s3.create({
            source_path : video.path,
            target_path : url,
            hearders    : {},
            callback    : function ( err ){
              var msg = '[img_processor][upload_videos](video) ';

              !err ?
                LOG.debug( msg + 's3.create success', url ) :
                LOG.error( msg + ' s3.create error', {
                  'error msg'   : err,
                  'source_path' : video.path,
                  'target_path' : url
                });

              ready();
            }
          });
        });
      });
    }

    flow.join().end( function (){
      callback( out );
    });
  },

  remove_videos : function ( args ){
    var self          = this;
    var current_video = args.current_video;
    var videos        = args.videos;
    var target_path;

    videos.forEach( function ( video ){
      target_path = video.key_name !== 'cover' ?
        current_video[ 'url' + video.key_name.match( /\d+$/ )[ 0 ]] :
        current_video.cover;

      if( !target_path ) return;

      self.s3.destroy({
        target_path : target_path,
        callback    : function ( err ){
          var msg = '[img_processor][remove_videos] ';

          !err ?
            LOG.debug( msg + 's3.destroy success', target_path ) :
            LOG.error( msg + 's3.destroy error', {
              'error msg'   : err,
              'target_path' : target_path
            });
        }
      });
    });
  }
};
