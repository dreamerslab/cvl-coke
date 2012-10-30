var Controller = require( './photos' );
var lang       = require( LANG_DIR + 'en_us/contact' );

module.exports = Controller.extend({

//--- before filters -----------------------------------------------------------

  locals : function ( req, res, next ){
    var keywords = [
      'Coverline',
      'fashion',
      req.form.type
    ].join( ', ' );

    res.locals({
      title       : 'Fashion - ' + req.form.type + ' | Coverline',
      controller  : 'fashion',
      types       : [ 'beauty', 'the-stylist' ],
      keywords    : keywords,
      description : lang.heading.default
    });

    next();
  }
});