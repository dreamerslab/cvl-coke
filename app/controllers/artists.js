var Controller = require( './photos' );
var lang       = require( LANG_DIR + 'en_us/contact' );

module.exports = Controller.extend({

//--- before filters -----------------------------------------------------------

  locals : function ( req, res, next ){
    var type     = req.form.type;
    var keywords = [
      'Coverline artists', 'artists', 'artists ' + type
    ].join( ', ' );

    res.locals({
      title       : 'Artists - ' + type + ' | Coverline',
      controller  : 'artists',
      types       : [ 'homme', 'femme' ],
      keywords    : keywords,
      description : lang.heading.default
    });

    next();
  }
});
