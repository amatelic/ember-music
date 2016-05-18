import Ember from 'ember';
//https://teamgaslight.com/blog/a-beginners-guide-to-the-ember-run-loop
export default Ember.Component.extend({
  classNames: ['video__player'],
  playlist: [],
  playListIndex: 0,
  audio: null,
  loop: false,
  toggle: false,
  currentTime: 0,
  durration: 0,
  volume: 100,
  /**
   * Observer for tracking if a track was changed in the playlist
   * (observer is called only from music route)
   * this.get('newTrack') -> is ember audio object
   */
  trackHasChanged: Ember.observer('newTrack', function() {
    let track = this.get('newTrack');
    if (track !== null) {
      this.changeAudio(track.get('path'));
    }
    
    this.set('newTrack', null);
  }),

  actions: {
    toggleTrack() {
      this.playingTrack();
    },

    setVolume() {
      this.set('volume', this.$('.volume_range').val());
      this.set('audio.volume', this.get('volume') / 100);
    },

    repeat() {
      this.set('audio.loop', !this.get('audio.loop'));
    },

    /**
     * Changing to the next track
     * @param numer   values [-1 or 1]
     * @return none
     */
    changeTruck(position) {
      let track = this.get('playing') + position;
      let len = this.get('playlist').length;
      track = track % len;
      track = (track < 0) ? len - 1 : track;
      this.set('playing', track);
      var newAudio = this.get('playlist').toArray()[track];
      this.changeAudio(newAudio.get('path'));
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
    const track = this.getTrackName();
    this.set('audio', new Audio(track.get('path')));
    this.get('audio').ontimeupdate = () => {
      if (this.get('toggle')) {
        this.set('currentTime', this.get('audio').currentTime);
      }
    };
  },

  /**
   * Gets the index of the track and return an ember music object
   * @param null
   * @return Ember Object[Musis]   -- basic data of file
   */

  getTrackName() {
    const index = this.get('playing');
    return (this.get('playlist').toArray()[index]);
  },

  /**
   * Resets and changes track for audio
   * @param String   --path to audio file
   * @return null
   */

  changeAudio(audio) {
    this.get('audio').pause();
    this.set('audio.src', audio);
    this.get('audio').play();
    this.set('toggle', true);
    this.set('duration', this.get('audio').duration);

  },

  /**
   * Method for toggeling tracks
   */

  playingTrack() {
    this.toggleProperty('toggle');
    if (this.get('toggle')) {
      this.get('audio').play();
    } else {
      this.get('audio').pause();
    }

    this.set('duration', this.get('audio').duration);
  },

});
