var Controller = require( './photos' );
var validate   = require( LIB_DIR + 'validations/photographer' );
var lang       = require( LANG_DIR + 'en_us/contact' );

module.exports = Controller.extend( validate, {

//--- before filters -----------------------------------------------------------

  locals : function ( req, res, next ){
    var photographer = res.local( 'photographers' )[ req.form.name ].name;
    var type         = req.form.type;

    var title = [
      'Photographer -', photographer, '-', type, ' | Coverline'
    ].join( ' ' );

    var keywords = [
      'Coverline photographer', photographer, type
    ].join( ', ' );

    res.locals({
      title       : title,
      controller  : 'photographer',
      types       : [ 'homme', 'femme' ],
      keywords    : keywords,
      description : lang.heading.default
    });

    next();
  }
});
