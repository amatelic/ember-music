import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['data-option'],
  didRender() {
    this._super(...arguments);
    let [x, y] = this.get('position');
    this.$().css({
      top: y,
      left: x,
    });
    this.$().siblings().one('click', function() {
      this.sendAction('hidePropery');
      return false;
    }.bind(this));
  },
  actions: {
    download() {
      this.sendAction('hidePropery');
      var link = document.createElement("a");
      link.href = this.get('data.path');
      link.click();
    },
    delete() {
      // /destroyRecord
      this.get('data').destroyRecord().then(function(d) {
        this.sendAction('hidePropery');
      }.bind(this));
    }
  }
});
