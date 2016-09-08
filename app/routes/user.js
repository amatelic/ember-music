import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return  {
      email: 'amatelic93@gmail.com',
      user: 'Anže Matelič',
    };
  }
});
