import Ember from 'ember';
import BodyClassMixin from 'ember-body-class/mixins/body-class';
import { storageFor } from 'ember-local-storage';

export default Ember.Route.extend(BodyClassMixin, {
  storage: storageFor('user'),
  redirect: function(a) {
    if (Ember.isEmpty(this.get('storage.user'))) {
      if (window.location.pathname === '/register') {
        this.transitionTo('register');
      } else {
        this.transitionTo('login');
      }
    } else {
      this.transitionTo('music');
    }
  },
});
