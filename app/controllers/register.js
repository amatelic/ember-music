import Ember from 'ember';
import $ from 'jquery';
import swal from 'sweetalert';
import { storageFor } from 'ember-local-storage';
export default Ember.Controller.extend({
  storage: storageFor('user'),
  actions: {
    registerUser() {
      let obj = this.getProperties('email', 'password', 'repassword');
      $.ajax({
        type: "POST",
        url: "http://localhost:5000/register",
        data: obj,
        success: function(res) {
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
