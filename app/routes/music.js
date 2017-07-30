import Ember from 'ember';
import  App from '../app'; //Need to make global variable for json meta data
import $ from 'jquery';
import ENV from '../config/environment';
import { storageFor } from 'ember-local-storage';
export default Ember.Route.extend({
  storage: storageFor('user'),
  ajax: Ember.inject.service(),
  model() {
    return Ember.RSVP.hash({
       tracks: this.store.findAll('music'),
      //  playing: 0,
       user: this.get('ajax').request(`${ENV.serverURl}/user/profile`, {
         data: {'api-key': this.get('storage.apiKey')}, method: 'GET'}),
     });
  },

  fileLoaded() {
     this.controllerFor('music').set('removePreview', true);
     this.controllerFor('music').set('errors', false);
   },

  setupController: function(controller, model) {
    this._super(controller, model);
    let track = (model.tracks && model.tracks.objectAt(0))
                        ? model.tracks.objectAt(0): null;
    console.log(controller, model);
    controller.set('tracks', model.tracks);
    controller.set('playing', track);
    controller.set('directory', App.storeMeta.music.directory);
    controller.set('directories', App.storeMeta.music.allDirectories);
    controller.set('isLoading', false);
  },

  actions: {

    logOut() {
      this.set('storage.user', undefined);
      this.transitionTo('login');
    },

    createFolder(name) {
      this.controllerFor('music').set('isLoading', true);
      Ember.$.ajax({
        type: 'POST',
        url: `${ENV.serverURl}/music/new_folder`,
        headers: {
          'Api-key': this.get('storage.apiKey'),
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
        url: `${ENV.serverURl}/music/upload`,
        headers: {
          'Api-key': this.get('storage.apiKey'),
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
        error: () => this.controllerFor('music').set('isLoading', false),

      });
      return false;
    },

    changeDirectory(folder) {
      this.controllerFor('music').set('directory', folder);
      folder = folder.toLowerCase();
      this.store.unloadAll();
      this.store.query('music', { params: folder, reload: true });
    },
  },

});
