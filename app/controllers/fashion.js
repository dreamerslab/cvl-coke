var Controller = require( './photos' );
var lang       = require( LANG_DIR + 'en_us/contact' );

module.exports = Controller.extend({

//--- before filters -----------------------------------------------------------

  locals : function ( req, res, next ){
    var type     = req.form.type;
    var keywords = [
      'Coverline fashion', 'fashion', 'fashion ' + type
    ].join( ', ' );

    res.locals({
      title       : 'Fashion - ' + type + ' | Coverline',
      controller  : 'fashion',
      types       : [ 'beauty', 'the-stylist' ],
      keywords    : keywords,
      description : lang.heading.default
    });

    next();
  }
});
