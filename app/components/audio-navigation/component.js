import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({
  addNewFile: false,
  classNames: ['audio__navigation'],
  actions: {
    addFolder() {
      this.toggleProperty('addNewFile');
      // code here will execute within a RunLoop in about 500ms with this == myContext

    },

    addNewFolder(e) {
      if (e.which === 13) {
        this.toggleProperty('addNewFile');
        this.sendAction('createFolder', e.target.value);
        e.target.value = '';
      }

      //bug for adding again
    },

    selectFolder(folder) {
      this.sendAction('changeDirectory', folder);
    },
  },
});
