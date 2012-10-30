var form  = require( 'express-form2' );
var field = form.field;
var lang  = require( LANG_DIR + 'en_us/validations' );
var r     = require( './regex' );

form.configure({
  autoTrim : true
});

module.exports = {

  validate : form(
    field( 'photo_name' ).is( r.photo_format, lang.invalid.photo ),
    field( 'photo_size' ).is( r.banner_size,  lang.invalid.banner_size )
  )
};