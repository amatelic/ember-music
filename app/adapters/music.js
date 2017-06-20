import JSONAPIAdapter from 'ember-data/adapters/json-api';
import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
import ENV from '../config/environment';

export default JSONAPIAdapter.extend({
  storage: storageFor('user'),
  host: `${ENV.serverURl}`,
  defaultSerializer: '-default',
  headers: Ember.computed('storage.apiKey', function() {
    return {
      'Api-key': this.get('storage.apiKey')
    };
  }),
  pathForType: function(type) {
    return Ember.String.underscore(type);
  },
});
