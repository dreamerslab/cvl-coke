var Photo = Model( 'Photo' );
var Flow  = require( 'node.flow' );
var img   = require( LIB_DIR + 'img_processor' );

module.exports = {

  init : function ( before, after ){
    before( this.is_authenticated );
    before( this.admin_locals );
    before( this.photographers );

    before( this.merge_uploads,     { only   : [ 'create', 'update' ]});
    before( this.validate_defaults, { except : [ 'create', 'update' ]});
    before( this.validate_create,   { only   : [ 'create' ]});
    before( this.validate_update,   { only   : [ 'update' ]});

    before( this.locals );
    before( this.album_name );
    before( this.current_pages );
    before( this.photo_id,          { except : [ 'new', 'create' ]});
    before( this.common_locals );
    before( this.current_photo,     { except : [ 'new', 'create', 'destroy' ]});
  },

//--- before filters -----------------------------------------------------------

  admin_locals : function ( req, res, next ){
    res.local( 'namespace', 'admin/' );
    next();
  },

  merge_uploads : function ( req, res, next ){
    var files  = req.files;
    var photos = [];
    var format = '';
    var flow   = new Flow();
    var each   = function ( key ){
      return function ( ready ){
        var file = files[ key ];

        if( file.size == '0' ) return ready();

        img.check_size( file.path, function ( err, photo ){
          req.body[ key + '_name' ] = file.name;
          req.body[ key + '_size' ] = photo.width + 'x' + photo.height;

          format = file.name.match( /.(png|jpg|jpeg)$/i );

          file.format   = format ? format[ 0 ] : file.type;
          file.key_name = key;

          photos.push( file );
          ready();
        });
      };
    };

    var key;

    for( key in files ){
      flow.parallel( each( key ));
    }

    flow.join().end( function (){
      req.photos = photos;
      next();
    });
  },

  current_photo : function ( req, res, next ){
    var args = {
      photo_id : req.photo_id
    };

    Photo.show( args, next, function (){
      next();
    }, function ( photo ){
      req.current_photo = photo;

      next();
    });
  },

//--- res ------------------------------------------------------------------

  render_new : function ( req, res ){
    res.render( 'admin/common/new', {
      title              : 'Add a photo to ' + res.local( 'title' ),
      admin_nav_selected : 'new',
      target_page        : res.local( 'current_pages' ) + 1
    });
  },

  render_edit : function ( req, res ){
    res.render( 'admin/common/edit', {
      title              : 'Edit a photo of ' + res.local( 'title' ),
      admin_nav_selected : 'edit',
      photo              : req.current_photo || {},
      target_page        : res.local( 'current_page' )
    });
  },

//--- actions ------------------------------------------------------------------

  new : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    this.render_new( req, res );
  },

  create : function ( req, res, next ){
    if( !req.form.isValid ) return this.render_new( req, res );

    img.upload_photos({
      album_name : req.current_album.name,
      photos     : req.photos
    }, function ( photo ){
      var args = {
        current_album : req.current_album,
        moved_photo   : photo,
        page          : req.form.target_page
      };

      Photo.insert( args, next, function ( current_page ){
        var url = res.local( 'url_prefix' ).replace( /\d+$/, current_page );

        res.redirect( url );
      });
    });
  },

  show : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    res.render( 'admin/common/show', {
      photo : req.current_photo || {}
    });
  },

  edit : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    this.render_edit( req, res );
  },

  update : function ( req, res, next ){
    if( !req.form.isValid ) return this.render_edit( req, res );

    var self = this;

    img.upload_photos({
      album_name : req.current_album.name,
      photos     : req.photos
    }, function ( photo ){
      var args = {
        current_album : req.current_album,
        moved_photo   : photo,
        photo_id      : req.photo_id,
        target_page   : req.form.target_page,
        current_page  : req.form.page
      };

      Photo.update_props( args, next,
        function (){
          self.fuckup( res );
        },
        function ( current_page ){
          var url = res.local( 'url_prefix' ).replace( /\d+$/, current_page );

          res.redirect( url );
        });
    });

    img.remove_photos({
      current_photo : req.current_photo,
      photos        : req.photos
    });
  },

  del_confirm : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    res.render( 'admin/common/del_confirm', {
      title              : 'Delete Confirm | Coverline',
      admin_nav_selected : 'del_confirm',
      photo              : req.current_photo || {}
    });
  },

  destroy : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    var self = this;
    var args = {
      photo_id      : req.photo_id,
      current_album : req.current_album,
      current_page  : req.form.page
    };

    Photo.destroy( args, next, function (){
      // always redirect to the first page after delete
      var url = res.local( 'url_prefix' ).replace( /\d+$/, 1 );

      res.redirect( url );
    });
  }
};
