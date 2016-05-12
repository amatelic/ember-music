import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  serialize(snapshot, options) {
  var json = this._super(...arguments);
  return json;
},
});
