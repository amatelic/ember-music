import Ember from 'ember';

export function musicTimer(params/*, hash*/) {
  return `${minuts(params[0])}:${seconds(params[0])}`;
}

function seconds(time) {
  time = parseInt(time % 60);
  return (time < 10) ? '0' + time : time;
}

function minuts(time) {
  return parseInt(time / 60);
}

export default Ember.Helper.helper(musicTimer);
