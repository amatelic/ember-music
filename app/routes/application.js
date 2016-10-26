import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend({
  storage: storageFor('user'),
  redirect: function() {
    if (Ember.isEmpty(this.get('storage.user'))) {
      if (window.location.pathname === '/register') {
        this.transitionTo('register');
      } else {
        this.transitionTo('login');
      }
    } else {
      this.transitionTo('music');
    }
  },
  actions: {
    showProperty(object, evt) {
      // this.setupController
      this.controllerFor('application').set('show', true);
      this.controllerFor('application').set('data', object);
      this.controllerFor('application').set('position', [evt.x, evt.y]);
    },

    hidePropery() {
      this.controllerFor('application').set('show', false);
    },
  }
});
