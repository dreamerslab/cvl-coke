var Controller = require( './application' );
var validate   = require( LIB_DIR + 'validations/video' );
var Album      = Model( 'VideoAlbum' );
var Video      = Model( 'Video' );
var lang       = require( LANG_DIR + 'en_us/contact' );

module.exports = Controller.extend( validate, {

  init : function ( before, after ){
    before( this.validate_defaults );
    before( this.is_valid );
    before( this.current_pages );
    before( this.current_pages_populated );
    before( this.covers );
    before( this.video_id );
  },

//--- before filters -----------------------------------------------------------

  is_valid : function ( req, res, next ){
    if( req.form.isValid ) return next();

    this.no_content( res );
  },

  current_pages : function ( req, res, next ){
    var self = this;

    Album.show( next,
      function (){
        self.fuckup( res );
      },
      function ( album ){
        req.current_album_ids_only = album;

        next();
      });
  },

  current_pages_populated : function ( req, res, next ){
    var self = this;

    Album.show_populated( next,
      function (){
        self.fuckup( res );
      },
      function ( album ){
        req.current_album = album;

        res.locals({
          current_pages : album.videos.length,
          current_page  : parseInt( req.form.page, 10 )
        });

        next();
      });
  },

  covers : function ( req, res, next ){
    var page   = res.local( 'current_page' );
    var pages  = res.local( 'current_pages' );
    var videos = req.current_album.videos;
    var covers = [];
    var index  = page - 1;
    var total  = pages < 3 ? pages : 3;

    if(( pages < 3 ) || ( page < 3 )){
      index = 1;
    }else if( page > ( pages - 3 )){
      index = pages - 2;
    }

    var i = index;
    var j = index + total;
    var video;

    for( ; i < j; i++ ){
      video = videos[ i - 1 ];

      covers.push({
        page : i,
        url  : video.cover
      });
    }

    res.local( 'covers', covers );
    next();
  },

  video_id : function ( req, res, next ){
    var page     = req.form.page;
    var video_id = req.current_album_ids_only.videos[ page - 1 ];

    req.video_id = video_id;

    next();
  },

//--- actions ------------------------------------------------------------------

// {
//   title         : 'Film | Coverline',
//   current_page  : 1,
//   current_pages : 4,
//   video_url     : '/videos/file-xxxxx.',
//   covers        : [{
//     page : 1,
//     url  : '/img/film/covers/cover-xxxxx.jpg'
//   }, {
//     page : 2,
//     url  : '/img/film/covers/cover-xxxxx.jpg'
//   }, {
//     page : 3,
//     url  : '/img/film/covers/cover-xxxxx.jpg'
//   }]
// }

  show : function ( req, res, next ){
    var self = this;
    var args = {
      video_id : req.video_id
    };

    Video.show( args, next,
      function (){
        self.no_content( res );
      },
      function ( video ){
        var keywords = [
          'Coverline',
          'film'
        ].join( ', ' );

        res.render( 'film/show', {
          title        : 'Film | Coverline',
          album_prefix : 'film',
          video        : video,
          keywords     : keywords,
          description  : lang.heading.default
        });
      });
  }
});