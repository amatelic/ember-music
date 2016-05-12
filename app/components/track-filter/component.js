import Ember from 'ember';

export default Ember.Component.extend({
  query: 'null',
  actions: {
    filterTrack(e, a) {
      console.log(this.get('query'), e, a);
    },
  },
});
