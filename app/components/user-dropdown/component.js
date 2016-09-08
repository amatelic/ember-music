import Ember from 'ember';

export default Ember.Component.extend({
  isHidden: true,
  mouseLeave: function() {
    this.set('isHidden', true);
  },
  actions: {
    toggleNavigation() {
      this.set('isHidden', false);
    }
  }
});
