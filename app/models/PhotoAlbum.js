module.exports = {

  statics : {

    insert : function ( args, next, created ){
      var self = this;
      var prop = {
        name : args.album_name
      };

      this.findOne( prop ).
        exec( function ( err, album ){
          if( err )   return next( err );
          if( album ) return created( album );

          new self( prop ).
            save( function ( err, album ){
              if( err ) return next( err );

              created( album );
            });
        });
    },

    show : function ( args, next, no_content, ok ){
      this.findOne({
        name : args.album_name
      }).exec( function ( err, album ){
        if( err )    return next( err );
        if( !album ) return no_content();

        ok( album );
      });
    }
  },

  methods : {

    insert_photo : function ( photo_id, target_page ){
      var page = parseInt( target_page, 10 );
      var pos  = page - 1;
      var len  = this.photos.length;

      if( pos < 0 )   pos = 0;
      if( pos > len ) pos = len;

      this.photos.splice( pos, 0, photo_id );

      return pos + 1;
    },

    move_photo : function ( current_page, target_page ){
      var len       = this.photos.length;
      var new_index = parseInt( target_page, 10 ) - 1;
      var old_index = parseInt( current_page, 10 ) - 1;

      if( new_index < 0 )   new_index = 0;
      if( new_index > len ) new_index = len - 1;

      if( new_index >= len ){
        var k = new_index - len;

        while(( k-- ) + 1 ){
          this.photos.push( UTILS.uid( 24 ));
        }
      }

      this.photos.splice( new_index, 0, this.photos.splice( old_index, 1 )[ 0 ]);

      return new_index + 1;
    },

    remove_photo : function ( target_page ){
      var pos = target_page - 1;

      this.photos.splice( pos, 1 );
    }
  }
};