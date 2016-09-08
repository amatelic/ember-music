import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['audio__playlist__main'],
  isHiddenMenu: false,
  actions: {
    showDialog(target, evt) {
      this.sendAction('showProperty', target, evt);

      return false;     // cancel default menu
    },
    selectTrack(trackIndex) {
      let track  = this.get('playlist').objectAt(trackIndex);
      this.set('playing', trackIndex);
      this.set('isHiddenMenu', false);
      this.sendAction('changeTrack', track);
    },
  },
});
