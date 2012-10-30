module.exports = {

  statics : {

    insert : function ( args, next, created ){
      var self = this;

      this.findOne().exec( function ( err, album ){
          if( err )   return next( err );
          if( album ) return created( album );

          new self().save( function ( err, album ){
            if( err ) return next( err );

            created( album );
          });
        });
    },

    show : function ( next, no_content, ok ){
      this.findOne().
        exec( function ( err, album ){
          if( err )    return next( err );
          if( !album ) return no_content();

          ok( album );
        });
    },

    show_populated : function ( next, no_content, ok ){
      this.findOne().
        populate( 'videos', 'cover url' ).
        exec( function ( err, album ){
          if( err )    return next( err );
          if( !album ) return no_content();

          ok( album );
        });
    }
  },

  methods : {

    insert_video : function ( video_id, target_page ){
      var page = parseInt( target_page, 10 );
      var pos  = page - 1;
      var len  = this.videos.length;

      if( pos < 0 )   pos = 0;
      if( pos > len ) pos = len;

      this.videos.splice( pos, 0, video_id );

      return pos + 1;
    },

    move_video : function ( current_page, target_page ){
      var len       = this.videos.length;
      var new_index = parseInt( target_page, 10 ) - 1;
      var old_index = parseInt( current_page, 10 ) - 1;

      if( new_index < 0 )   new_index = 0;
      if( new_index > len ) new_index = len - 1;

      if( new_index >= len ){
        var k = new_index - len;

        while(( k-- ) + 1 ){
          this.videos.push( UTILS.uid( 24 ));
        }
      }

      this.videos.splice( new_index, 0, this.videos.splice( old_index, 1 )[ 0 ]);

      return new_index + 1;
    },

    remove_video : function ( target_page ){
      var pos = target_page - 1;

      this.videos.splice( pos, 1 );
    }
  }
};