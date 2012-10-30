var Controller    = require( './application' );
var validate      = require( LIB_DIR + 'validations/photos' );
var photographers = require( BASE_DIR + 'db/photographers' );
var Album         = Model( 'PhotoAlbum' );
var Photo         = Model( 'Photo' );

module.exports = Controller.extend( validate, {

  init : function ( before, after ){
    before( this.photographers );
    before( this.validate_defaults );
    before( this.is_valid );
    before( this.locals );
    before( this.album_name );
    before( this.current_pages );
    before( this.photo_id );
    before( this.common_locals );
  },

//--- before filters -----------------------------------------------------------

  photographers : function ( req, res, next ){
    res.local( 'photographers', photographers );
    next();
  },

  is_valid : function ( req, res, next ){
    if( req.form.isValid ) return next();

    this.no_content( res );
  },

  album_name : function ( req, res, next ){
    var controller   = res.local( 'controller' );
    var name         = req.form.name;
    var tmp          = name ? [ controller, name ] : [ controller ];
    var album_prefix = tmp.slice( 0 );
    var album_name   = tmp.slice( 0 );

    album_name.push( req.form.type );
    res.locals({
      album_prefix : album_prefix.join( '/' ),
      album_name   : album_name.join( '-' )
    });

    next();
  },

  current_pages : function ( req, res, next ){
    var self = this;
    var args = {
      album_name : res.local( 'album_name' )
    };

    Album.show( args, next,
      function (){
        self.no_content( res );
      },
      function ( album ){
        req.current_album = album;

        res.local( 'current_pages', album.photos.length );
        next();
      });
  },

  photo_id : function ( req, res, next ){
    var page   = req.form.page;
    var photos = req.current_album.photos;

    req.photo_id = photos[ page - 1 ];

    next();
  },

  common_locals : function ( req, res, next ){
    var type         = req.form.type;
    var page         = req.form.page;
    var album_prefix = res.local( 'album_prefix' );
    var url_prefix   = res.local( 'namespace' ) ?
      [ 'admin', album_prefix, type, page ] :
      [ album_prefix, type, page ];

    res.locals({
      url_prefix   : '/' + url_prefix.join( '/' ),
      name         : req.form.name,
      type         : type,
      current_page : page,
      photo        : req.current_album.photos
    });

    next();
  },

//--- actions ------------------------------------------------------------------

  show : function ( req, res, next ){
    var self = this;
    var args = {
      photo_id : req.photo_id
    };

    Photo.show( args, next, function (){
      self.no_content( res );
    }, function ( photo ){
      res.render( 'common/show', {
        photo : photo
      });
    });
  }
});