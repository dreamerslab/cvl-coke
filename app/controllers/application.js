var Class = require( 'node.class' );

module.exports = Class.extend({

  is_authenticated : function ( req, res, next ){
    if( req.session.is_authenticated ) return next();

    res.redirect( '/admin/login' );
  },

  validation : function ( err, req, res, next ){
    if( err.name && err.name == 'ValidationError' ){
      var error;

      for( error in err.errors ){
        req.flash( 'flash-error', err.errors[ error ].message );
      }

      res.redirect( 'back' );
      LOG.error( 500, res, err );

      return;
    }

    next( err );
  },

  unique : function ( err, req, res, next ){
    if( err.name && err.name == 'MongoError' ){
      req.flash( 'flash-error', err.err );
      res.redirect( 'back' );
      LOG.error( 409, res, err );
    }

    next( err );
  },

  no_content : function ( res ){
    res.render( 'error/404', {
      layout : false
    });
  },

  fuckup : function ( res ){
    res.render( 'error/500', {
      layout : false
    });
  }
});