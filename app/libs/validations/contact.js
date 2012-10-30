var form  = require( 'express-form2' );
var field = form.field;
var lang  = require( LANG_DIR + 'en_us/validations' );

form.configure({
  autoTrim : true
});

module.exports = {

  validate : form(
    field( 'email' ).
      trim().
      required( '', lang.required.email ).
      isEmail( lang.invalid.email ),
    field( 'name' ).
      trim().
      required( '', lang.required.email_name ),
    field( 'msg' ).
      trim().
      required( '', lang.required.msg )
  )
};