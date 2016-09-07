import JSONAPIAdapter from 'ember-data/adapters/json-api';
import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default JSONAPIAdapter.extend({
  storage: storageFor('user'),
  host: 'http://localhost:5000',
  defaultSerializer: '-default',
  headers: Ember.computed('storage.user', function() {
    return {
      'Api-key': this.get('storage.user')
    };
  }),
  pathForType: function(type) {
    return Ember.String.underscore(type);
  },
});
