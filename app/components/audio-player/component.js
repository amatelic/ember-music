import Ember from 'ember';
import { EKMixin } from 'ember-keyboard';
import { keyUp} from 'ember-keyboard';

//https://teamgaslight.com/blog/a-beginners-guide-to-the-ember-run-loop
export default Ember.Component.extend(EKMixin, {
  classNames: ['video__player'],
  playlist: [],
  repeatIsActive: false,
  playListIndex: 0,
  audio: null,
  loop: false,
  toggle: false,
  currentTime: Ember.computed('audio.src', function() {
    return this.get('audio.currentTime');
  }),
  duration: Ember.computed('audio.duration', function() {
    return this.get('audio.duration');
  }),
  volume: 100,

  /**
   * Observer for tracking if a track was changed in the playlist
   * (observer is called only from music route)
   * this.get('newTrack') -> is ember audio object
   */
  trackHasChanged: Ember.observer('playing',  function() {
    let track = this.get('playing');
    if (track !== null && track !== undefined) {
      this.changeAudio(track.get('path'));
    }

    this.set('newTrack', null);
  }),

  //Keyboard events
  nKeyword: Ember.on(keyUp('ctrl+n'), function() {this.send('changeTruck', 1);}),

  pKeyword: Ember.on(keyUp('ctrl+p'), function() {this.send('changeTruck', -1);}),

  sKeyword: Ember.on(keyUp('ctrl+s'), function() {this.playingTrack();}),

  actions: {
    toggleTrack() {
      this.playingTrack();
    },

    setVolume() {
      this.set('volume', this.$('.volume_range').val());
      this.set('audio.volume', this.get('volume') / 100);
    },

    repeat() {
      this.toggleProperty('repeatIsActive');
      this.set('audio.loop', !this.get('audio.loop'));
    },

    /**
     * Changing to the next track
     * @param numer   values [-1 or 1]
     * @return none
     */
    changeTruck(position) {
      let playlist = this.get('playlist');
      let size = playlist.get('length') - 1;
      let index = playlist.indexOf(this.get('playing'));
      index = index + position;
      if (size >= index && index > -1)  {
        let newTrack = playlist.objectAt(index);
        this.set('playing', newTrack);
        this.changeAudio(newTrack.get('path'))
      }
    },
    /**
     * @TODO find a way how to not distrby the avdio
     */
    onMouseDown() {
      this.set('toggle', false);
    },
    onMouseUp() {
      var time = parseFloat(this.$('.player_range').val());
      this.set('audio.currentTime', time);
      Ember.run.next(() => {
        this.playingTrack();
      });
    },
  },

  /**
   * Resets and changes track for audio
   * @param String   --path to audio file
   * @return null
   */

  changeAudio(path) {
    this.set('toggle', false);
    let audio = this.get('audio');
    audio.src = path;
    this.get('audio').load();
    this.set('toggle', true);

    this.get('audio').addEventListener('canplaythrough', function() {
      this.get('audio').play();
      this.set('duration', audio.duration);
    }.bind(this), false);

  },

  /**
   * Method for toggeling tracks
   */

  playingTrack() {
    this.toggleProperty('toggle');
    if (this.get('toggle')) {
      Ember.run.next(() => {
        this.get('audio').play();
      });
    } else {
      Ember.run.next(() => {
        this.get('audio').pause();
      });
    }
  },

  init() {
    this._super(...arguments);
    const track = this.get('playing');
    this.set('audio', new Audio());

    if (track) {
      this.set('audio.src', track.get('path'));
    }

    this.set('audio.volume', 0.2); // remove
    this.get('audio').ontimeupdate = () => {
      if (this.get('toggle')) {
        this.set('currentTime', this.get('audio').currentTime);
      }
    };

  },
  /**
   * Pausing audio player and removing audio track timer
   * @method willDestroyElement
   * @return {[undefined]}
   */

  willDestroyElement() {
    this._super(...arguments);
    this.get('audio').pause();
    this.get('audio').ontimeupdate = undefined;
  }
});
