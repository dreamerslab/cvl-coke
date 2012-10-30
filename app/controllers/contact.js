var Controller = require( CONTROLLER_DIR + 'application' );
var validate   = require( LIB_DIR + 'validations/contact' );
var mailer     = require( LIB_DIR + 'mailer' );
var lang       = require( LANG_DIR + 'en_us/contact' );

module.exports = Controller.extend( validate, {

  init : function ( before, after ){
    before( this.locals );
    before( this.validate, { only : [ 'send' ]});
    before( this.is_valid, { only : [ 'send' ]});
  },

//--- before filters -----------------------------------------------------------

  locals : function ( req, res, next ){
    var keywords = [
      'Coverline',
      'contact'
    ].join( ', ' );

    res.locals({
      title       : lang.title,
      heading     : lang.heading.default,
      url         : req.headers.referer || '/',
      text        : 'Go Back',
      keywords    : keywords,
      description : lang.heading.default
    });

    next();
  },

  is_valid : function ( req, res, next ){
    if( req.form.isValid ) return next();

    var errs = req.form.getErrors;

    res.render( 'contact/index', {
      user : req.body,
      url  : req.body.url,
      err  : {
        email : errs( 'email' )[ 0 ],
        name  : errs( 'name' )[ 0 ],
        msg   : errs( 'msg' )[ 0 ]
      }
    });
  },

//--- actions ------------------------------------------------------------------

  index : function ( req, res, next ){
    res.render( 'contact/index' );
  },

  send : function ( req, res, next ){
    var self   = this;
    var locals = {};

    mailer( req.form, function ( err, msg ){
      if( err ){
        locals.err = {
          msg : lang.error
        };

        LOG.error( 500, res, err );
      }else{
        locals.heading = lang.heading.sent;
      }

      locals.url = req.body.url;

      res.render( 'contact/index', locals );
    });
  }
});