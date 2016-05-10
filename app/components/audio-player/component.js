import Ember from 'ember';
//https://teamgaslight.com/blog/a-beginners-guide-to-the-ember-run-loop
export default Ember.Component.extend({
  playlist: [],
  playListIndex: 0,
  audio: null,
  loop: false,
  toggle: false,
  currentTime: 0,
  durration: 0,
  volume: 100,
  actions: {
    toggle() {
      this.togglePlayer();
    },

    setVolume() {
      this.set('volume', this.$('.volume_range').val());
      this.set('audio.volume', this.get('volume') / 100);
    },

    repeat() {
      this.set('audio.loop', !this.get('audio.loop'));
    },

    changeTruck(position) {
      let track = this.get('playing') + position;
      let len = this.get('playlist').length;
      track = track % len;
      track = (track < 0) ? len - 1 : track;
      this.set('playing', track);
      var newAudio = this.get('playlist').objectAt(this.get('playing'));
      this.changeAudio(newAudio.path);
    },
    /**
     * @TODO find a way how to not distrby the avdio
     */
    setPosition() {
      // this.togglePlayer();
      // var time = parseFloat(this.$('.player_range').val());
      // this.set('audio.currentTime', time);
      // console.log(this.get('audio.currentTime'));
      // this.set('currentTime', time);
      // this.togglePlayer();
    },
  },
  init() {
    this._super(...arguments);
    const index = this.get('playing');
    const track = this.get('playlist').objectAt(index);
    this.set('audio', new Audio(track.path));
    this.get('audio').ontimeupdate = () => {
      if (this.get('toggle')) {
        this.set('currentTime', this.get('audio').currentTime);
      }
    };
  },

  changeAudio(audio) {
    this.get('audio').pause();
    this.set('audio.src', audio);
    this.get('audio').play();
  },

  togglePlayer() {
    this.toggleProperty('toggle');

    if (this.get('toggle')) {
      this.get('audio').play();
    } else {
      this.get('audio').pause();
    }

    this.set('duration', this.get('audio').duration);
  },

});
