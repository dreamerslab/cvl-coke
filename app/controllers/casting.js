var Controller = require( './photos' );
var lang       = require( LANG_DIR + 'en_us/contact' );

module.exports = Controller.extend({

//--- before filters -----------------------------------------------------------

  locals : function ( req, res, next ){
    var keywords = [
      'Coverline',
      'casting',
      req.form.type
    ].join( ', ' );

    res.locals({
      title       : 'Casting - ' + req.form.type + ' | Coverline',
      controller  : 'casting',
      types       : [ 'homme', 'femme' ],
      keywords    : keywords,
      description : lang.heading.default
    });

    next();
  }
});