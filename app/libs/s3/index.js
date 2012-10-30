var cp = require( 'child_process' );

var create_child = function ( method, args ){
  var child        = cp.fork( __dirname + '/child' );
  var default_args = {
    method        : method,
    config        : CONF.aws,
    times_tried   : 0,
    max_try_times : 4
  };

  args = UTILS.merge( default_args, args );

  child.send( args );

  child.on( 'message', function( msg ){
    if( msg.err && args.times_tried < args.max_try_times ){
      args.times_tried += 1;
      create_child( method, args );
    }else{
      args.callback && args.callback( msg.err );
    }

    child.kill();
  });
};

module.exports = {
  create : function( args ){
    create_child( 'create', args );
  },

  destroy : function( args ){
    create_child( 'destroy', args );
  }
};