var form  = require( 'express-form2' );
var field = form.field;
var lang  = require( LANG_DIR + 'en_us/validations' );
var r     = require( './regex' );

form.configure({
  autoTrim : true
});

module.exports = {

  validate_defaults : form(
    field( 'page' ).required()
  ),

  validate_create : form(
    field( 'video1' ).required( '', lang.required.video ).is( r.video1_format, lang.invalid.video1 ),
    field( 'video2' ).required( '', lang.required.video ).is( r.video2_format, lang.invalid.video2 ),
    field( 'cover' ).required( '',  lang.required.photo ).is( r.photo_format,  lang.invalid.photo ),
    field( 'cover_size' ).is( r.cover_size, lang.invalid.cover_size ),
    field( 'page' ).required(),
    field( 'target_page' ).required( '', lang.required.target_page ).isInt( lang.invalid.target_page )
  ),

  validate_update : form(
    field( 'video1' ).is(     r.video1_format, lang.invalid.video1 ),
    field( 'video2' ).is(     r.video2_format, lang.invalid.video2 ),
    field( 'cover' ).is(      r.photo_format,  lang.invalid.photo ),
    field( 'cover_size' ).is( r.cover_size,    lang.invalid.cover_size ),
    field( 'page' ).required(),
    field( 'target_page' ).required( '', lang.required.target_page ).isInt( lang.invalid.target_page )
  )
};