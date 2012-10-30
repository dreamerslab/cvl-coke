var Controller = require( '../film' );
var Album      = Model( 'VideoAlbum' );
var Video      = Model( 'Video' );
var Flow       = require( 'node.flow' );
var img        = require( LIB_DIR + 'img_processor' );
var ten_min    = 1000 * 60 * 10;

module.exports = Controller.extend({

  init : function ( before, after ){
    before( this.is_authenticated );
    before( this.admin_locals );

    before( this.merge_uploads,     { only   : [ 'create', 'update' ]});
    before( this.validate_defaults, { except : [ 'create', 'update' ]});
    before( this.validate_create,   { only   : [ 'create' ]});
    before( this.validate_update,   { only   : [ 'update' ]});

    before( this.current_pages );
    before( this.current_pages_populated );
    before( this.covers );

    before( this.video_id,      { except : [ 'new', 'create' ]});
    before( this.current_video, { except : [ 'new', 'create', 'destroy' ]});
  },

//--- before filters -----------------------------------------------------------

  admin_locals : function ( req, res, next ){
    res.locals({
      namespace    : 'admin/',
      album_prefix : 'film'
    });
    next();
  },

  merge_uploads : function ( req, res, next ){
    req.connection.setTimeout( ten_min );

    var files  = req.files;
    var videos = [];
    var format = '';
    var flow   = new Flow();
    var each   = function ( key ){
      return function ( ready ){
        var file = files[ key ];

        if( file.size == '0' ) return ready();

        if( key !== 'cover' ){
          format          = file.name.match( /.(webm|mp4)$/i );
          file.format     = format ? format[ 0 ] : file.type;
          file.key_name   = key;
          req.body[ key ] = file.name;

          videos.push( file );

          return ready();
        }

        img.check_size( file.path, function ( err, photo ){
          req.cover           = file;
          req.body.cover      = file.name;
          req.body.cover_size = photo.width + 'x' + photo.height;

          file.key_name = key;

          videos.push( file );

          ready();
        });
      };
    };

    var key;

    for( key in files ){
      flow.parallel( each( key ));
    }

    flow.join().end( function (){
      req.videos = videos;

      next();
    });
  },

  current_video : function ( req, res, next ){
    var args = {
      video_id : req.video_id
    };

    Video.show( args, next, function (){
      next();
    }, function ( video ){
      req.current_video = video;

      next();
    });
  },

//--- res ------------------------------------------------------------------

  render_new : function ( req, res ){
    res.render( 'admin/film/new', {
      title              : 'Add a film',
      admin_nav_selected : 'new',
      target_page        : res.local( 'current_pages' ) + 1
    });
  },

  render_edit : function ( req, res ){
    res.render( 'admin/film/edit', {
      title              : 'Edit a film',
      admin_nav_selected : 'edit',
      video              : req.current_video || null,
      target_page        : res.local( 'current_page' )
    });
  },

//--- actions ------------------------------------------------------------------

// {
//   namespace     : 'admin/',
//   title         : 'Film | Coverline',
//   target_page   : 1,
//   current_page  : 1,
//   current_pages : 4,
//   video         : {
//     cover : '/img/film/covers/cover-xxxx1.jpg',
//     url1  : '/videos/video-xxxx1.mp4',
//     url2  : '/videos/video-xxxx1.webm'
//   },
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

  new : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    this.render_new( req, res );
  },

  create : function ( req, res, next ){
    if( !req.form.isValid ) return this.render_new( req, res );

    img.upload_videos({
      cover  : req.cover,
      videos : req.videos
    }, function ( video ){
      var args = {
        current_album : req.current_album_ids_only,
        page          : req.form.target_page,
        video         : video
      };

      Video.insert( args, next, function ( current_page ){
        res.redirect( '/admin/film/' + current_page );
      });
    });
  },

// {
//   namespace     : 'admin/',
//   title         : 'Film | Coverline',
//   current_page  : 1,
//   current_pages : 4,
//   video         : {
//     cover : '/img/film/covers/cover-xxxx1.jpg',
//     url1  : '/videos/video-xxxx1.mp4',
//     url2  : '/videos/video-xxxx1.webm'
//   },
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
    if( !req.form.isValid ) return this.no_content( res );

    var url  = 'admin/film/show';
    var args = {
      video_id : req.video_id
    };

    res.local( 'title', 'Film | Coverline' );
    Video.show( args, next,
      function (){
        res.render( url );
      },
      function ( video ){
        res.render( url, {
          video : video
        });
      });
  },

  edit : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    this.render_edit( req, res );
  },

  update : function ( req, res, next ){
    if( !req.form.isValid ) return this.render_edit( req, res );

    var self = this;

    img.upload_videos({
      cover  : req.cover,
      videos : req.videos
    }, function ( video ){
      var args = {
        current_album  : req.current_album_ids_only,
        uploaded_video : video,
        video_id       : req.video_id,
        target_page    : req.form.target_page,
        current_page   : req.form.page
      };

      Video.update_props( args, next,
        function (){
          self.fuckup( res );
        },
        function ( current_page ){
          var url = '/admin/film/' + current_page;

          res.redirect( url );
        });
    });

    img.remove_videos({
      current_video : req.current_video,
      videos        : req.videos
    });
  },

  del_confirm : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    res.render( 'admin/film/del_confirm', {
      title              : 'Delete Confirm | Coverline',
      admin_nav_selected : 'del_confirm',
      video              : req.current_video || null,
    });
  },

  destroy : function ( req, res, next ){
    if( !req.form.isValid ) return this.no_content( res );

    var self = this;
    var args = {
      video_id      : req.video_id,
      current_album : req.current_album,
      current_page  : req.form.page
    };

    Video.destroy( args, next,
      function (){
        self.no_content( res );
      },
      function (){
        res.redirect( '/admin/film/1' );
      });
  }
});
