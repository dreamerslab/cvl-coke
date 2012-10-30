module.exports = {

  ori_schema : '20121008',

  export : function ( Model ){
    var Album = Model( 'VideoAlbum' );
    var Video = Model( 'Video' );
    var fs    = require( 'fs' );

    return {

      init : function ( series, parallel, join, end ){
        series( this.all_videos );
        series( this.remove_videos );
        end( this.empty_album );
      },

      all_videos : function ( next ){
        Video.find().
          select( 'url cover' ).
          exec( function ( err, videos ){
            if( !err ){
              fs.writeFileSync( BASE_DIR + 'tmp/ori_videos.json', JSON.stringify( videos ));
              return next();
            }

            LOG.error( '[export][all_videos]fail to query all the videos', err );
            process.exit( 0 );
          });
      },

      remove_videos : function ( next ){
        Video.remove( function ( err, count ){
          if( !err ) return next();

          LOG.error( '[export][remove_videos] fail to remove videos', err );
          process.exit( 0 );
        });
      },

      empty_album : function ( end ){
        Album.findOne().
          exec( function ( err, _album ){
            _album.photos = [];
            _album.save( function ( err, _album ){
              if( !err ) return end();

              LOG.error( '[export][empty_album] fail to empty album', err );
              process.exit( 0 );
            });
          });
      }
    };
  },

  import : function ( Model ){
    var Album = Model( 'VideoAlbum' );
    var Video = Model( 'Video' );

    var fs      = require( 'fs' );
    var Flow    = require( 'node.flow' );
    var img     = require( LIB_DIR + 'img_processor' );
    var pub_dir = PUB_DIR.replace( /\/+$/, '' );
    var formats = [ 'mp4', 'webm' ];
    var videos  = JSON.parse( fs.readFileSync( BASE_DIR + 'tmp/ori_videos.json' ));

    var new_videos = [];
    var album;

    return {

      init : function ( series, parallel, join, end ){
        series( this.upload_to_s3 );
        series( this.current_album );
        end( this.create_videos );
      },

      upload_to_s3 : function ( end ){
        var flow = new Flow();

        videos.forEach( function ( video ){
          var new_video = {};
          var i         = 0;

          var each = function ( i ){
            return function ( ready ){
              var format = formats[ i ];
              var url, target_path;

              if( i !== 2 ){
                // video
                url         = video.url + format;
                target_path = '/videos/video-' + UTILS.uid( 5 ) + '.' + format;
                new_video[ 'url' + ( i + 1 )] = target_path;
              }else{
                // cover
                url             = video.cover;
                target_path     = video.cover;
                new_video.cover = video.cover;
              }

              img.s3.create({
                source_path : pub_dir + url,
                target_path : target_path,
                headers     : {},
                callback    : function (){
                  ready();
                }
              });
            };
          };

          for( ; i < 3; i++ ){
            flow.parallel( each( i ));
          }

          flow.join();
          flow.series( function ( next ){
            new_videos.push( new_video );
            next();
          });
        });

        flow.end( function (){
          end();
        });
      },

      current_album : function ( next ){
        Album.findOne().
          exec( function ( err, _album ){
            album = _album;

            next();
          });
      },

      create_videos : function ( end ){
        var flow = new Flow();

        new_videos.forEach( function ( video ){
          flow.parallel( function ( ready ){
            new Video( video ).save( function ( err, video ){
              if( err ){
                LOG.error( '[import][create_videos] fail to create a video', err );
                return process.exit( 0 );
              }

              album.videos.push( video._id );
              album.save( function ( err, _album ){
                if( !err ) return ready();

                LOG.error( '[import][create_videos] fail to update the album', err );
                process.exit( 0 );
              });
            });
          });
        });

        flow.join().end( function (){
          end();
        });
      }
    };
  }
};
