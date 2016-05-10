import Ember from 'ember';

export function truncateText(params/*, hash*/) {
  var text = params[0];
  var len = params[1];
  text = (text.length > len) ? `${text.substr(0, len - 3)}...` : text;
  return Ember.String.htmlSafe(text);
}

export default Ember.Helper.helper(truncateText);
