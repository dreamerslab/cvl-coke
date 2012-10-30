var email  = require( 'emailjs' );
var server = email.server.connect( CONF.mail );

module.exports = function ( args, callback ){
  server.send({
    from    :  args.email,
    // to      :  'fred <cjw3112386@gmail.com>', // for test
    to      : 'ramon@coverline.com.tw',
    subject : '[coverline.com.tw]Comments',
    text    :  args.msg  + ' Message from ' + args.name
  }, callback );
};