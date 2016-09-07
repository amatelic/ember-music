import Model from 'ember-data/model';
import attr from 'ember-data/attr';
export default Model.extend({
  title: attr('string'),
  artist: attr('string'),
  album: attr('string'),
  path: attr('string'),
  date: attr('moment'),
});
