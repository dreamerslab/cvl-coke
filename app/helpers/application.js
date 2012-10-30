var moment = require( 'moment' );

module.exports = function ( app ){
  app.helpers({

    contact_link : function ( url, text ){
      url  = url || '/contact';
      text = text || 'Contact Us';

      var id = url === '/contact' ? 'contact-us' : 'go-back';

      return '<a id=\"' + id + '\" href=\"' + url + '\">' + text + '</a>';
    },

    date : function ( date, format ){
      return moment( date ).format( format || 'MMM Do YYYY, h:m:s' );
    },

    default_album_img : function ( url, replacement, prefix ){
      return url ?
        ( prefix + url ) :
        ( '/img/admin/default-album-img-' + replacement + '.png' );
    },

    exist : function ( obj, exist, not_exist ){
      if( obj ) return exist();

      return not_exist && not_exist();
    },

    film_pre_pager : function ( page, ori_url ){
      page = parseInt( page, 10 );
      page -= 1;

      return page === 0 ?
        '<a id=\"film-previous\">Pre</a>' :
        '<a id=\"film-previous\" href=\"' + ori_url + '/' + page + '\">Pre</a>';
    },

    film_next_pager : function ( page, ori_url, pages ){
      page = parseInt( page, 10 );
      page += 1;

      return page > pages ?
        '<a id=\"film-next\">Next</a>' :
        '<a id=\"film-next\" href=\"' + ori_url + '/' + page + '\">Next</a>';
    },

    home_link : function ( namespace ){
      return namespace ? '/admin' : '/';
    },

    img_title : function ( album_name, type, page, extra ){
      return [ album_name, type, page, extra ].join( '-' );
    },

    pre_pager : function ( page, prefix ){
      page = parseInt( page, 10 );
      page -= 1;

      return page === 0 ?
        '<a id=\"photo-previous\" class=\"nav-disable\"></a>' :
        '<a id=\"photo-previous\" href=\"' + prefix + page + '\">' + page + '</a>';
    },

    namespaced_url : function ( namespace, url ){
      return '/' + ( namespace ?
        namespace + url : url );
    },

    next_pager : function ( page, prefix, pages ){
      page = parseInt( page, 10 );
      page += 1;

      return page > pages ?
        '<a id=\"photo-next\" class=\"nav-disable\"></a>' :
        '<a id=\"photo-next\" href=\"' + prefix + page + '\">' + page + '</a>';
    },

    selected : function ( target, current, replacement ){
      var selected = replacement ? replacement : 'selected';

      return target == current ? selected : '';
    },

    show_err : function ( err ){
      return err ?
        '<label class="error">' + err + '</label>' : '';
    },

    show_form_err : function ( field, tip ){
      if( UTILS.is( field ) === 'array' ){
        var i = 0;
        var j = field.length;
        var msg;

        for(; i < j; i++ ){
          if( this.get_form_err()[ field[ i ]]){
            msg = this.get_form_err()[ field[ i ]][ 0 ];

            break;
          }
        }

        return msg ?
          '<p class="error">' + msg + '</p>' :
          ( tip || '' );
      }

      return this.get_form_err()[ field ] ?
        '<p class="error">' + this.get_form_err()[ field ][ 0 ] + '</p>' :
        ( tip || '' );
    },

    show_videos_for_mobile : function ( is_mobile, show_videos_for_mobile, show_videos_for_desktop ){
      return is_mobile ?
        show_videos_for_mobile() :
        show_videos_for_desktop();
    },

    type_link : function ( namespace, album_prefix, type, current_type, current_page ){
      var page = type == current_type ? current_page : 1;
      var url  = [ album_prefix, type, page ].join( '/' );

      return this.namespaced_url( namespace, url );
    },

    val : function ( obj, prop ){
      return obj === undefined ? '' : obj[ prop ];
    }
  });

  app.dynamicHelpers({

    get_form_err : function ( req, res ){
      return function (){
        return req.form ?
          req.form.getErrors() : {};
      }
    },

    messages : require( 'express-messages' )
  });
};
