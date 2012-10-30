var Album      = Model( 'PhotoAlbum' );
var VideoAlbum = Model( 'VideoAlbum' );

var albums = [
  'fashion-beauty',
  'fashion-the-stylist',
  'artists-homme',
  'artists-femme',
  'casting-homme',
  'casting-femme',
  'photographer-loki-tsai-homme',
  'photographer-loki-tsai-femme',
  'photographer-minshi-jiang-homme',
  'photographer-minshi-jiang-femme',
  'photographer-jack-wang-homme',
  'photographer-jack-wang-femme'
];

var videoalbums = [ '' ];

var msg = '[libs][albums] ';

var error = function ( err ){
  LOG.error( 500, msg + 'Fail to create album', err );
};

var success = function ( album ){
  LOG.debug( msg + 'Successfully created album', album );
};

module.exports = {
  init : function (){
    albums.forEach( function ( album_name ){
      Album.insert({
        album_name : album_name
      }, error, success );
    });

    videoalbums.forEach( function (){
      VideoAlbum.insert( {}, error, success );
    });
  }
};