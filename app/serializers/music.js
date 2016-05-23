import  App from '../app';
import JSONAPISerializer from 'ember-data/serializers/json-api';
export default JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    App.storeMeta[primaryModelClass.modelName] = payload.meta; //ember data only allows meta data on 'query', this adds support for all other methods
    return this._super(...arguments);
  },
});
