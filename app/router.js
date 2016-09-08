import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('music');
  this.route('login');
  this.route('register');
  this.route('user');
});

export default Router;
