module.exports = function ( map ){
  map.get( '/', 'home#index' );

  map.get(  'artists/:type/:page',            'artists#show' );
  map.get(  'casting/:type/:page',            'casting#show' );
  map.get(  'fashion/:type/:page',            'fashion#show' );
  map.get(  'photographer/:name/:type/:page', 'photographer#show' );
  map.get(  'film/:page',                     'film#show' );

  map.get(  'contact', 'contact#index' );
  map.post( 'contact', 'contact#send' );

  map.get( 'admin', 'admin/home#index' );
  map.put( 'admin', 'admin/home#update' );
  map.namespace( 'admin', function ( admin ){
    admin.get(    'edit',                       'home#edit' );
    admin.get(    'artists/:type/:page',        'artists#show' );
    admin.get(    'artists/:type/:page/new',    'artists#new' );
    admin.get(    'artists/:type/:page/edit',   'artists#edit' );
    admin.post(   'artists/:type/:page/',       'artists#create' );
    admin.put(    'artists/:type/:page/',       'artists#update' );
    admin.get(    'artists/:type/:page/delete', 'artists#del_confirm' );
    admin.delete( 'artists/:type/:page/',       'artists#destroy' );

    admin.get(    'casting/:type/:page',         'casting#show' );
    admin.get(    'casting/:type/:page/new',     'casting#new' );
    admin.get(    'casting/:type/:page/edit',    'casting#edit' );
    admin.post(   'casting/:type/:page/',        'casting#create' );
    admin.put(    'casting/:type/:page/',        'casting#update' );
    admin.get(    'casting/:type/:page/delete',  'casting#del_confirm' );
    admin.delete( 'casting/:type/:page/',        'casting#destroy' );

    admin.get(    'fashion/:type/:page',        'fashion#show' );
    admin.get(    'fashion/:type/:page/new',    'fashion#new' );
    admin.get(    'fashion/:type/:page/edit',   'fashion#edit' );
    admin.post(   'fashion/:type/:page/',       'fashion#create' );
    admin.put(    'fashion/:type/:page/',       'fashion#update' );
    admin.get(    'fashion/:type/:page/delete', 'fashion#del_confirm' );
    admin.delete( 'fashion/:type/:page/',       'fashion#destroy' );

    admin.get(    'film/:page',        'film#show' );
    admin.get(    'film/:page/new',    'film#new' );
    admin.get(    'film/:page/edit',   'film#edit' );
    admin.post(   'film/:page/',       'film#create' );
    admin.put(    'film/:page/',       'film#update' );
    admin.get(    'film/:page/delete', 'film#del_confirm' );
    admin.delete( 'film/:page/',       'film#destroy' );

    admin.get(    'photographer/:name/:type/:page',        'photographer#show' );
    admin.get(    'photographer/:name/:type/:page/new',    'photographer#new' );
    admin.get(    'photographer/:name/:type/:page/edit',   'photographer#edit' );
    admin.post(   'photographer/:name/:type/:page/',       'photographer#create' );
    admin.put(    'photographer/:name/:type/:page/',       'photographer#update' );
    admin.get(    'photographer/:name/:type/:page/delete', 'photographer#del_confirm' );
    admin.delete( 'photographer/:name/:type/:page/',       'photographer#destroy' );

    admin.get(    'login',    'sessions#new' );
    admin.post(   'sessions', 'sessions#create' );
    admin.delete( 'sessions', 'sessions#destroy' );
  });
};
