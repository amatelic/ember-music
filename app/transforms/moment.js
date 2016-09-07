import Transform from 'ember-data/transform';
import  moment from 'moment';
export default Transform.extend({
  serialize: function(value) {
    return value ? value.toJSON() : null;
  },

  deserialize: function(value) {
    return moment(value, 'DD/MM/YYYY');
  }
});
