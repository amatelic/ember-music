import Model from 'ember-data/model';
import attr from 'ember-data/attr';
export default Model.extend({
  name: attr(),
  artist: attr(),
  album: attr(),
  path: attr(),
  date: attr(),
});
