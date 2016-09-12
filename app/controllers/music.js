import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
export default Ember.Controller.extend({
  storage: storageFor('user'),
  actions: {
    myStartAction() {
      console.log('start');
    },
    myOverAction() {
      console.log('end')
    }
  }
});
