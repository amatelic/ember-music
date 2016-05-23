import Ember from 'ember';
export default Ember.Component.extend({
  classNames: ['audio__playlist__filter'],
  actions: {
    filterTrack(query) {
      this.sendAction('filterTracks', query);
    },
  },
});
