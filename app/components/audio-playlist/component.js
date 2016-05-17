import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    selectTrack(trackIndex) {
      this.set('playing', trackIndex);
      this.sendAction('changeTrack');
    },
  },
});
