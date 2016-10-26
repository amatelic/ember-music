import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
  storage: storageFor('user'),
  ajax: Ember.inject.service(),
  model() {
    return this.get('ajax').request('http://localhost:5000/profile', {
      data: {user: this.get('storage.user')}, method: 'GET',
    });

  },

  actions: {
    changeData() {
      let data = document.getElementById('files').files[0];
      var formData = new FormData();
      if (!Ember.isEmpty(data.name)) {
        formData.append('image', `http://localhost:5000/users/${data.name}`);
      }
      formData.append("username", this.controllerFor("user").get('model.username'));
      formData.append("email", this.controllerFor("user").get('model.email')); // number 123456 is immediately converted to a string "123456"
      formData.append("file", data);
      var request = new XMLHttpRequest();
      request.open("POST", "http://localhost:5000/profile");
      request.send(formData);
      request.onload = function() {
      if (request.status === 200) {
        alert('success');
      } else {
        alert('fail');
      }
    };
    }
  }
});
