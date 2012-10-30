var hooks = require( MODEL_DIR + 'hooks/video' );

module.exports = {

  hooks : {
    post : {
      remove : [
        hooks.remove_from_s3
      ]
    }
  },

  statics : {

    insert : function ( args, next, created ){
      var self  = this;
      var album = args.current_album;

      new self( args.video ).save( function ( err, video, count ){
        if( err ) return next( err );

        var current_page = album.insert_video( video._id, args.page );

        album.save( function ( err, album ){
          if( err ) return next( err );

          created( current_page );
        });
      });
    },

    show : function ( args, next, no_content, ok ){
      this.findById( args.video_id, function ( err, video ){
        if( err )    return next( err );
        if( !video ) return no_content(); // video not found page

        ok( video );
      });
    },

    update_props : function ( args, next, no_content, ok ){
      var self     = this;
      var album    = args.current_album;

      self.findById( args.video_id, function ( err, video ){
        if( err )    return next( err );
        if( !video ) return no_content();

        video.update_props_from( args.uploaded_video );
        video.save( function ( err, video ){
          var current_page = album.move_video( args.current_page, args.target_page );

          album.save( function ( err, video ){
            if( err ) return next( err );

            ok( current_page );
          });
        });
      });
    },

    destroy : function ( args, next, no_content, deleted ){
      var self  = this;
      var album = args.current_album;

      album.remove_video( args.current_page );
      album.save( function ( err, album ){
        if( err ) return next( err );

        self.findById( args.video_id, function ( err, video ){
          if( err )    return next( err );
          if( !video ) return no_content();

          video.remove( function ( err ){
            if( err ) return next( err );

            deleted();
          });
        });
      });
    }
  },

  methods : {

    update_props_from : function ( uploaded_video ){
      var self = this;

      Object.keys( uploaded_video ).forEach( function ( key ){
        if( uploaded_video[ key ] !== undefined ){
          self[ key ] = uploaded_video[ key ];
        }
      });
    }
  }
};