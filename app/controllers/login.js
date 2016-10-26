import Ember from 'ember';
import $ from 'jquery';
import { storageFor } from 'ember-local-storage';
import swal from 'sweetalert';
export default Ember.Controller.extend({
  storage: storageFor('user'),
  actions: {
    loginUser() {
      let obj = this.getProperties('email', 'password');
      $.ajax({
        type: "POST",
        url: "http://localhost:5000/user",
        data: obj,
        success: function(res) {
          // console.log(this.get('storage.user'))
          if (res.status === 404) {
            swal('Oops...', res.error, "error");
          } else {
            this.set('storage.user', res.email);
            this.transitionToRoute('music');
          }
        }.bind(this),
      });
    }
  }
});
