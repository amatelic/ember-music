import Ember from 'ember';
import $ from 'jquery';
import { storageFor } from 'ember-local-storage';
import swal from 'sweetalert';
export default Ember.Controller.extend({
  storage: storageFor('user'),
  email: "",
  password: "",
  isValidEmail: true,
  isEmpty: true,
  actions: {
    loginUser() {
      this.set('isValidEmail', true);
      this.set('isEmpty', true);
      let obj = this.getProperties('email', 'password');
      var re = /\S+@\S+\.\S+/;
      if (!re.test(obj.email)) {
        this.set('isValidEmail', false);
        return;
      }

      if (obj.password === "") {
        this.set('isEmpty', false);
        return;
      }

      $.ajax({
        type: "POST",
        url: "http://localhost:5000/user",
        data: obj,
        success: function(res) {
          if (res.status === 404) {
            swal('Oops...', res.error, "error");
          } else {
            this.set('storage.apiKey', res.data.apiKey);
            this.transitionToRoute('music');
          }
        }.bind(this),
      });
    }
  }
});
