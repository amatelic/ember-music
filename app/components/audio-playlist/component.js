import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['audio__playlist__main'],
  isPlaying: 0,
  isHiddenMenu: false,
  isChanged: Ember.observer('playing', function() {
    let playlist = this.get('playlist');
    let index = playlist.indexOf(this.get('playing'));
    this.set('isPlaying', index);
  }),
  actions: {
    showDialog(target, evt) {
      this.sendAction('showProperty', target, evt);

      return false;     // cancel default menu
    },
    selectTrack(track, index) {
      this.set('isPlaying', index);
      this.sendAction('changeTrack', track);
    },
  },
});
