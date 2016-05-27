import Ember from 'ember';
import $ from 'jquery';
let {run} = Ember;
function hideContent(e) {
  if (!$(e.target).hasClass('playlist__input')) {
    this.set('addNewFile', false);
    return;
  }
  //Fixe for if user first clicks on the input value
  $('body').one('click', hideContent.bind(this));
}

export default Ember.Component.extend({
  addNewFile: false,
  classNames: ['audio__navigation'],
  actions: {
    addFolder() {
      if (!this.get('addNewFile')) {
        this.toggleProperty('addNewFile');

        //Problem because element is stil not renderd have
        //schedule task
        run.scheduleOnce('afterRender', this, () => {
          this.$('.playlist__input').focus();
        });
        $('body').one('click', hideContent.bind(this));
      }
    },

    addNewFolder(e) {
      if (e.which === 13) {
        this.sendAction('createFolder', e.target.value);
        $('body').click(); //DON'T REMOVE bug with removing event on body
        e.target.value = '';
      }

      //bug for adding again
    },

    selectFolder(folder) {
      this.sendAction('changeDirectory', folder);
    },
  },
});
