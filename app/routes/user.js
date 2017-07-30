import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
import ENV from '../config/environment';

export default Ember.Route.extend({
  storage: storageFor('user'),
  ajax: Ember.inject.service(),
  model() {
    return this.get('ajax').request(`${ENV.serverURl}/user/profile`, {
      data: {'api-key': this.get('storage.apiKey')}, method: 'GET'})
  },

  actions: {
    logOut() {
      this.get('storage').reset();
      this.transitionTo('login');
    },

    changeData() {
      let data = document.getElementById('files').files[0];
      var formData = new FormData();
      if (!Ember.isEmpty(data.name)) {
        formData.append('image', `${ENV.serverURl}/users/${data.name}`);
      }
      formData.append("username", this.controllerFor("user").get('model.username'));
      formData.append("email", this.controllerFor("user").get('model.email')); // number 123456 is immediately converted to a string "123456"
      formData.append("apiKey", this.get('storage.apiKey'));
      formData.append("file", data);
      var request = new XMLHttpRequest();
      request.open("POST", `${ENV.serverURl}/user/profile/update`);
      request.send(formData);
      request.onload = function() {
      if (request.status === 200) {
        this.transitionTo('music');
      } else {
        alert('fail');
      }
    }.bind(this);
    }
  }
});
