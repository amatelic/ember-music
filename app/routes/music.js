import Ember from 'ember';
import  App from '../app'; //Need to make global variable for json meta data
import $ from 'jquery';
import ENV from '../config/environment';
import { storageFor } from 'ember-local-storage';
export default Ember.Route.extend({
  storage: storageFor('user'),
  model() {
    return Ember.RSVP.hash({
       tracks: this.store.findAll('music'),
       playing: 0,
     });
  },

  fileLoaded() {
     this.controllerFor('music').set('removePreview', true);
     this.controllerFor('music').set('errors', false);
   },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('all-tracks', model.tracks);
    controller.set('tracks', model.tracks);
    controller.set('directory', App.storeMeta.music.directory);
    controller.set('directories', App.storeMeta.music.allDirectories);
    controller.set('isLoading', false);
  },

  actions: {

    logOut() {
      this.set('storage.user', undefined);
      this.transitionTo('login');
    },
    filterTracks(query) {
      var expresion = new RegExp(query);
      this.controllerFor('music').set('tracks', this.store.filter('music', d => {
        return expresion.test(d.get('title')) || expresion.test(d.get('album')) ||
        expresion.test(d.get('artist'));
      }));
    },

    createFolder(name) {
      this.controllerFor('music').set('isLoading', true);
      Ember.$.ajax({
        type: 'POST',
        url: `${ENV.serverURl}/new_folder`,
        headers: {
          'Api-key': this.get('storage.user'),
        },
        data: {
          name: name,
        },
        success: (res) => {
          this.controllerFor('music').set('isLoading', false);
          this.controllerFor('music').get('directories').addObject(res.dir);
        },
      });
    },

    changeTrack(track) {
      this.controllerFor('music').set('newTrack', track);
    },

    fileLoaded(file) {
      this.controllerFor('music').set('isLoading', true);
      let dir = this.controllerFor('music').get('directory');
      let length = this.store.peekAll('music').toArray().length;
      let data = new FormData();
      data.append('directory', dir);
      data.append('file', file);
      data.append('id', length);
      $.ajax({
        type: 'POST',
        url: `${ENV.serverURl}/upload`,
        headers: {
          'Api-key': this.get('storage.user'),
        },
        dataType: 'json',
        processData:false,
        contentType:false,
        data: data,
        async: true,
        success: res => {
          this.controllerFor('music').set('isLoading', false);
          this.store.createRecord('music', res.data.attributes);
        },
        error: (d) => this.controllerFor('music').set('isLoading', false),

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
