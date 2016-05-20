import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['audio__playlist__main'],
  actions: {
    selectTrack(trackIndex) {
      let track  = this.get('playlist').objectAt(trackIndex);
      this.set('playing', trackIndex);
      this.sendAction('changeTrack', track);
    },
  },
});
