import JSONAPIAdapter from 'ember-data/adapters/json-api';
import Ember from 'ember';

export default JSONAPIAdapter.extend({
  host: 'http://localhost:5000',
  defaultSerializer: '-default',
  pathForType: function(type) {
    return Ember.String.underscore(type);
  },
});
