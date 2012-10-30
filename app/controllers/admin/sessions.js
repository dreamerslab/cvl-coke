var Application = require( '../application' );

module.exports = Application.extend({

  new : function ( req, res, next ){
    res.render( 'sessions/new', {
      layout : false
    });
  },

  create : function ( req, res, next ){
    if( req.body.password !== CONF.password ){
      return res.render( 'sessions/new', {
        layout    : false,
        login_err : 'Wrong password'
      });
    }

    req.session.is_authenticated = true;

    res.redirect( '/admin' );
  },

  destroy : function ( req, res, next ){
    req.session.destroy();

    res.redirect( '/' );
  }
});