import Ember from 'ember';
import  App from '../app';
import $ from 'jquery';
export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
       tracks: this.store.findAll('music'),
       playing: 0,
     });
  },

  fileLoaded(e) {
     this.controllerFor('music').set('removePreview', true);
     this.controllerFor('music').set('errors', false);
   },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('all-tracks', model.tracks);
    controller.set('tracks', model.tracks);
    controller.set('directory', App.storeMeta.music.directory);
    controller.set('directories', App.storeMeta.music.allDirectories);
  },

  actions: {
    filterTracks(query) {
      var expresion = new RegExp(query);
      this.controllerFor('music').set('tracks', this.store.filter('music', d => {
        return expresion.test(d.get('name')) || expresion.test(d.get('album'))
        || expresion.test(d.get('artist'));
      }));
    },

    createFolder(name) {
      Ember.$.ajax({
        type: 'POST',
        url: 'http://localhost:5000/new_folder',
        data: {
          name: name,
        },
        success: (res) => {
          this.controllerFor('music').get('directories').addObject(res.dir);
        },
      });
    },

    changeTrack(track) {
      this.controllerFor('music').set('newTrack', track);
    },

    fileLoaded(file) {
      let dir = this.controllerFor('music').get('directory');
      let data = new FormData();
      data.append('directory', dir);
      data.append('file', file);
      $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/upload',
        dataType: 'json',
        processData:false,
        contentType:false,
        data: data,
        async: true,
        success: res => {
          this.store.createRecord('music', res.data.attributes);
        },

        error: (d) => {
          console.error(d);
        },

      });
      return false;
    },

    changeDirectory(folder) {
      this.controllerFor('music').set('directory', folder);
      folder = folder.toLowerCase();
      this.store.unloadAll();
      this.store.queryRecord('music', { params: folder, reload: true });
    },
  },
});
