import Ember from 'ember'

export default Ember.Route.extend({
  model() {
    return {
      tracks: [
        {
          name: 'Memory Museum copy',
          artist: 'Bla',
          album: 'Code Geass',
          date: new Date('10/2/2014').toString(),
          path: './music/24. Memory Museum copy.mp3',
        },
        {
          name: 'Misconduct copy',
          artist: 'Bla',
          album: 'Code Geass',
          date: new Date('10/2/2014').toString(),
          path: './music/27. Misconduct copy.mp3',
        },
        {
          name: 'Check Mate',
          artist: 'Bla',
          album: 'Code Geass',
          date: new Date('10/2/2015').toString(),
          path: './music/28. Check Mate copy.mp3',
        },
      ],
      playing: 0,
    };
  },
});
