import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
export default Ember.Controller.extend({
  storage: storageFor('user'),
  showNavigation: false,
  actions: {
    myStartAction() {
      console.log('start');
    },
    myOverAction() {
      console.log('end');
    },
    showNavigation() {
      this.set('showNavigation', true);
    },
    hideNavigation() {
      this.set('showNavigation', false);
    }
  }
});
