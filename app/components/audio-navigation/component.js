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
  classNameBindings: ['toggleNav'],
  toggleNav: false,
  classNames: ['audio__navigation'],
  image: Ember.computed('thumbnail', function() {
    console.log(this.get('thumbnail'))
    const image = (this.get('thumbnail'))
      ?  `http://localhost:5000/${ this.get('thumbnail')  }`
      : 'http://blog.blogtalkradio.com/wp-content/uploads/2011/10/Audio_Icon.jpg';

      return image;
  }),
  actions: {
    hideNavigation() {
      this.sendAction('hideNavigation');
    },
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

    },

    selectFolder(folder) {
      this.sendAction('changeDirectory', folder);
    },
  },
});
