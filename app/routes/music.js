import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
       tracks: this.store.findAll('music').then(musics => {
         return musics.map(music => Ember.Object.create(music.toJSON()));
       }),
       playing: 0,
     });
  },

  fileLoaded(e) {
     console.log(e);
     this.controllerFor('music').set('removePreview', true);
     this.controllerFor('music').set('errors', false);
   },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('tracks', model.tracks);
  },

  actions: {
    filterTracks(query) {
      var expresion = new RegExp(query);
      this.controllerFor('music').set('tracks', this.store.filter('music', d => {
        return expresion.test(d.get('name')) || expresion.test(d.get('album'))
        || expresion.test(d.get('artist'));
      }));
    },

    fileLoaded(file) {
      let data = new FormData();
      console.log(file)
      data.append('test', file);
      Ember.$.ajax({
        type: 'POST',
        url: 'http://localhost:5000/upload',
        dataType: 'multipart/form-data',
        processData:false,
        contentType:false,
        data: data,
        success: function () {
            alert('Data Uploaded: ');
        },
      });
      return false;
    },
  },
});
