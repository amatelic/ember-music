import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({
  addNewFile: false,
  classNames: ['audio__navigation'],
  folders: ['all', 'french', 'spain'],
  actions: {
    addFolder() {
      console.log('bla')
      this.set('addNewFile', true);
      $('.playlist__add').find('input').focus();
    },

    addNewFolder(e) {
      if (e.which === 13) {
        this.set('addNewFile', false);
        this.sendAction('createFolder', e.target.value);
        e.target.value = ' ';
      }
      //bug for adding again
      $('body').one('click', (e) => {
        this.set('addNewFile', false);
      });
    },
  },
});
