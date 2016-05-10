import Ember from 'ember';
//https://teamgaslight.com/blog/a-beginners-guide-to-the-ember-run-loop
export default Ember.Component.extend({
  audio: null,
  loop: false,
  toggle: false,
  currentTime: 0,
  durration: 0,
  volume: 100,
  actions: {
    play() {
      this.toggleProperty('toggle');

      if (this.get('toggle')) {
        this.get('audio').play();
      } else {
        this.get('audio').pause();
      }

      this.set('duration', this.get('audio').duration);
    },

    setVolume() {
      this.set('volume', this.$('.volume_range').val());
      this.set('audio.volume', this.get('volume') / 100);
    },

    repeat() {
      this.set('audio.loop', !this.get('audio.loop'));
    },

    setPosition() {
      this.set('audio.currentTime', this.$('.player_range').val());
      this.set('currentTime', this.$('.player_range').val());
    },
  },
  init() {
    this._super(...arguments);
    this.set('audio', new Audio('track.mp3'));
    this.get('audio').ontimeupdate = () => {
      this.set('currentTime', this.get('audio').currentTime);
    };
  },

});
