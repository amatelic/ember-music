import Ember from 'ember';
import $ from 'jquery';
import swal from 'sweetalert';
import ENV from '../config/environment';
import { storageFor } from 'ember-local-storage';
import _ from 'lodash';

export default Ember.Controller.extend({
  hasError: {
    formIsEmpty: true,
    isEmail: true,
    isSamePassword: true
  },
  storage: storageFor('user'),
  actions: {
    registerUser() {
      let values = this.getProperties('email', 'password', 'repassword');

      if (this.isCorrectValues(values)) {
        return;
      }

      $.ajax({
        type: "POST",
        url: `${ENV.serverURl}/user/register`,
        data: values,
        success: function(res) {
          if (res.status === 404) {
            swal('Oops...', res.error, "error");
          } else {
            this.set('storage.apiKey', res.data.apiKey);
            this.transitionToRoute('music');
          }
        }.bind(this),
      });
    },
  },

  isCorrectValues({email, password, repassword}) {
    this.set('hasError.formIsEmpty', true);
    this.set('hasError.isSamePassword', true);
    this.set('hasError.isEmail', true);

    if(_.isEmpty(email) || _.isEmpty(password) || _.isEmpty(repassword)) {
      this.set('hasError.formIsEmpty', false);
      return true;
    }

    if(!/\S+@\S+\.\S+/.test(email)) {
      this.set('hasError.isEmail', false);
      return true;
    }

    if(password !== repassword) {
      this.set('hasError.isSamePassword', false);
      return true;
    }

    return false;
  }
});
