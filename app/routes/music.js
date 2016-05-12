import Ember from 'ember'

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
       tracks: this.store.findAll('music').then(musics => {
         return musics.map(music => Ember.Object.create(music.toJSON()));
       }),
       playing: 0,
     });
  },
});
