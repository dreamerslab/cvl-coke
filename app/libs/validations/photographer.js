var form  = require( 'express-form2' );
var field = form.field;
var lang  = require( LANG_DIR + 'en_us/validations' );
var r     = require( './regex' );

form.configure({
  autoTrim : true
});

module.exports = {

  validate_defaults : form(
    field( 'type' ).required(),
    field( 'name' ).required(),
    field( 'page' ).required()
  ),

  validate_create : form(
    field( 'photo1_name' ).required( '', lang.required.photo ).is( r.photo_format, lang.invalid.photo ),
    field( 'photo2_name' ).required( '', lang.required.photo ).is( r.photo_format, lang.invalid.photo ),
    field( 'photo3_name' ).required( '', lang.required.photo ).is( r.photo_format, lang.invalid.photo ),
    field( 'photo4_name' ).is( r.photo4_format, lang.invalid.photo4 ),
    field( 'photo1_size' ).is( r.photo_side_size,   lang.invalid.photo1_n_3_size ),
    field( 'photo2_size' ).is( r.photo_center_size, lang.invalid.photo2_size ),
    field( 'photo3_size' ).is( r.photo_side_size,   lang.invalid.photo1_n_3_size ),
    field( 'photo4_size' ).is( r.photo4_size,       lang.invalid.photo4_size ),
    field( 'type' ).required(),
    field( 'name' ).required(),
    field( 'page' ).required(),
    field( 'target_page' ).required( '', lang.required.target_page ).isInt( lang.invalid.target_page )
  ),

  validate_update : form(
    field( 'photo1_name' ).is( r.photo_format,  lang.invalid.photo ),
    field( 'photo2_name' ).is( r.photo_format,  lang.invalid.photo ),
    field( 'photo3_name' ).is( r.photo_format,  lang.invalid.photo ),
    field( 'photo4_name' ).is( r.photo4_format, lang.invalid.photo4 ),
    field( 'photo1_size' ).is( r.photo_side_size,   lang.invalid.photo1_n_3_size ),
    field( 'photo2_size' ).is( r.photo_center_size, lang.invalid.photo2_size ),
    field( 'photo3_size' ).is( r.photo_side_size,   lang.invalid.photo1_n_3_size ),
    field( 'photo4_size' ).is( r.photo4_size,       lang.invalid.photo4_size ),
    field( 'type' ).required(),
    field( 'name' ).required(),
    field( 'page' ).required(),
    field( 'target_page' ).required( '', lang.required.target_page ).isInt( lang.invalid.target_page )
  )
};