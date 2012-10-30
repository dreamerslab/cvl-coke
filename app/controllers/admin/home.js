var fs          = require( 'fs' );
var Application = require( '../application' );
var validate    = require( LIB_DIR + 'validations/home' );
var img         = require( LIB_DIR + 'img_processor' );
var banner      = BASE_DIR + 'db/banner.json';

module.exports = Application.extend( validate, {

  init : function ( before, after ){
    before( this.is_authenticated );
    before( this.locals );

    before( this.merge_uploads, { only : [ 'update' ]});
    before( this.validate,      { only : [ 'update' ]});
    before( this.is_valid,      { only : [ 'update' ]});
  },

//--- before filters -----------------------------------------------------------

  merge_uploads : function ( req, res, next ){
    var file = req.files.banner;

    if( file.size == '0' ) return next();

    img.check_size( file.path, function ( err, photo ){
      if( err ) return next();

      req.body.photo_name = file.name;
      req.body.photo_size = photo.width + 'x' + photo.height;

      next();
    });
  },

  is_valid : function ( req, res, next ){
    if( req.form.isValid ) return next();

    res.render( 'admin/home/edit' );
  },

  locals : function ( req, res, next ){
    fs.readFile( banner, function ( err, data ){
      if( err ) return next();

      res.locals({
        namespace : 'admin/', // for `show` only
        banner    : JSON.parse( data )
      });

      next();
    });
  },

//--- actions ------------------------------------------------------------------

  index : function ( req, res, next ){
    res.render( 'admin/home/index' );
  },

  edit : function ( req, res, next ){
    res.render( 'admin/home/edit' );
  },

  update : function ( req, res, next ){
    var ori_path    = res.local( 'banner' );
    var target_path = '/img/photos/banner-' + UTILS.uid( 5 ) + '.jpg';
    var msg         = '[controller][home][update] ';

    fs.writeFileSync( banner, JSON.stringify( target_path ));

    img.s3.create({
      source_path : req.files.banner.path,
      target_path : target_path,
      hearders    : {},
      callback    : function ( err ){
        err && LOG.error( msg + 's3.create error', {
          'error msg' : err,
          'ori_path'  : ori_path
        });

        LOG.debug( msg + ' s3.create success', ori_path );

        res.redirect( '/admin' );
      }
    });

    img.s3.destroy({
      target_path : ori_path,
      callback    : function ( err ){
        err && LOG.error( msg + 's3.destroy error', {
          'error msg' : err,
          'ori_path'  : ori_path
        });

        LOG.debug( msg + 's3.destroy success', ori_path );
      }
    });
  }
});
