var img_processor = require( LIB_DIR + 'img_processor' );

module.exports = {

// --- post remove --------------------------------------------------------------

  remove_from_s3 : function ( img ){
    var target_path;
    var i = 1;
    var j = 5;

    for(; i < j ; i++ ){
      target_path = img[ 'url' + i.toString()];

      if( !target_path ) break;

      img_processor.s3.destroy({
        target_path : target_path,
        callback    : function ( err ){
          var msg = '[hooks][photo][remove_from_s3] ';

          err && LOG.error( msg + 's3.destroy error', {
            'error msg'   : err,
            'target_path' : target_path
          });

          LOG.debug( msg + 's3.destroy success', target_path );
        }
      });
    }
  }
};
