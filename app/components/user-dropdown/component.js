import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
  isHidden: true,
  classNames: ['user-data'],
  userImage: Ember.computed('user.image', function() {
    return `${ENV.serverURl}/${this.get('user.image')}`;
  }),
  mouseLeave: function() {
    this.set('isHidden', true);
  },
  actions: {
    toggleNavigation() {
      this.set('isHidden', false);
    }
  }
});
