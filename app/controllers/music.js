import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
export default Ember.Controller.extend({
  storage: storageFor('user'),
  showNavigation: false,
  actions: {
    changeTrack(track) {
      this.set('playing', track);
      this.notifyPropertyChange('playing');
    },
    filterTracks(query) {
      var expresion = new RegExp(query);
      Ember.run.debounce(this, function() {
        let tracks = this.store.filter('music', d => {
          return expresion.test(d.get('title')) || expresion.test(d.get('album')) ||
          expresion.test(d.get('artist'));

        });
        this.set('tracks', tracks);
      }, 1000);

    },
    showNavigation() {
      this.set('showNavigation', true);
    },
    hideNavigation() {
      this.set('showNavigation', false);
    }
  }
});
