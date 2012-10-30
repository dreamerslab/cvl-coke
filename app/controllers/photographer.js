var Controller = require( './photos' );
var validate   = require( LIB_DIR + 'validations/photographer' );
var lang       = require( LANG_DIR + 'en_us/contact' );

module.exports = Controller.extend( validate, {

//--- before filters -----------------------------------------------------------

  locals : function ( req, res, next ){
    var photographer = res.local( 'photographers' )[ req.form.name ].name;
    var type         = req.form.type;
    var keywords     = [
      'Coverline',
      'photographer',
      photographer,
      req.form.type
    ].join( ', ' );

    res.locals({
      title       : [ 'Photographer -', photographer, '-', type, '| Coverline' ].join( ' ' ),
      controller  : 'photographer',
      types       : [ 'homme', 'femme' ],
      keywords    : keywords,
      description : lang.heading.default
    });

    next();
  }
});