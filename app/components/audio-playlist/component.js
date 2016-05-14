import Ember from 'ember';

export default Ember.Component.extend({
  actions: {

    filter(query) {
      console.log(query);
    },
    
    selectTrack(trackIndex) {
      this.set('playing', trackIndex);
    },
  },
});
