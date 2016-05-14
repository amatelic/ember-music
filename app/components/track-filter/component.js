import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    filterTrack(query) {
      this.sendAction('filterTracks', query);
    },
  },
});
