var Schema = function ( Schema ){

/**
 * Module dependencies.
 * @private
 */
  var ObjectId = Schema.ObjectId;
  var Models   = {

    PhotoAlbum : new Schema({
      name       : { type : String, required : true }, // artist-femme
      photos     : [{ type : ObjectId, ref : 'Photo', required : true, index : true }],
      created_at : { type : Number, 'default' : Date.now },
      updated_at : { type : Number }
    }),

    Photo : new Schema({
      url1       : { type : String, required  : true },
      url2       : { type : String, required  : true },
      url3       : { type : String, required  : true },
      url4       : { type : String, 'default' : '' },
      created_at : { type : Number, 'default' : Date.now },
      updated_at : { type : Number }
    }),

    VideoAlbum : new Schema({
      videos     : [{ type : ObjectId, ref : 'Video', required : true, index : true }],
      created_at : { type : Number, 'default' : Date.now },
      updated_at : { type : Number }
    }),

    Video : new Schema({
      cover      : { type : String, required : true }, // photo url, ex. /img/videos/1.png
      url        : { type : String, required : true }, // video url
      created_at : { type : Number, 'default' : Date.now },
      updated_at : { type : Number }
    })
  };

  // auto update `updated_at` on save
  Object.keys( Models ).forEach( function ( model ){
    if( Models[ model ].tree.updated_at !== undefined ){
      Models[ model ].pre( 'save', function ( next ){
        this.updated_at = this.isNew?
          this.created_at :
          Date.now();

        next();
      });
    }
  });

  return Models;
};

/**
 * Exports module.
 */
module.exports = Schema;