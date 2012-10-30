var hooks = require( MODEL_DIR + 'hooks/photo' );

module.exports = {

  hooks : {
    post : {
      remove : [
        hooks.remove_from_s3
      ]
    }
  },

  statics : {

/**
   * Create photo record, move tmp photo to public
   * @public
   * @function
   * @param {Object} args An argument object for creating a photo
   * @param {Object} args.current_album
   * @param {Function} next Next controller handler
   * @param {Function} created Success handler
   */
    insert : function ( args, next, created ){
      var self  = this;
      var album = args.current_album;

      new self( args.moved_photo ).save( function ( err, photo, count ){
        if( err ) return next( err );

        var current_page = album.insert_photo( photo._id, args.page );

        album.save( function ( err, album ){
          if( err ) return next( err );

          created( current_page );
        });
      });
    },

    show : function ( args, next, no_content, ok ){
      this.findById( args.photo_id, function ( err, photo ){
        if( err )    return next( err );
        if( !photo ) return no_content(); // photo not found page

        ok( photo );
      });
    },

    update_props : function ( args, next, no_content, ok ){
      var self  = this;
      var album = args.current_album;

      self.findById( args.photo_id, function ( err, photo ){
        if( err )    return next( err );
        if( !photo ) return no_content();

        photo.update_props_from( args.moved_photo );
        photo.save( function ( err, photo ){
          var current_page = album.move_photo( args.current_page, args.target_page );

          album.save( function ( err, photo ){
            if( err ) return next( err );

            ok( current_page );
          });
        });
      });
    },

    destroy : function ( args, next, deleted ){
      var self  = this;
      var album = args.current_album;

      album.remove_photo( args.current_page );
      album.save( function ( err, album ){
        if( err ) return next( err );

        self.findById( args.photo_id, function ( err, photo ){
          if( err )    return next( err );
          if( !photo ) return no_content();

          photo.remove( function ( err ){
            if( err ) return next( err );

            deleted();
          });
        });
      });
    }
  },

  methods : {

    update_props_from : function ( moved_photo ){
      var self = this;

      Object.keys( moved_photo ).forEach( function ( key ){
        if( moved_photo[ key ] !== undefined ){
          self[ key ] = moved_photo[ key ];
        }
      });
    }
  }
};