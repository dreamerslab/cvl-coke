( function ( $, window ){
  $( '.file-input' ).change( function(){
    $this = $( this );
    $this.prev().text( $this.attr( 'value' ));
  });
})( jQuery, window );