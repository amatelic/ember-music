import Ember from 'ember';

export default Ember.Component.extend({
  isHidden: true,
  classNames: ['user-data'],
  userImage: Ember.computed('user.image', function() {
    return `http://localhost:5000/${this.get('user.image')}`;
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
