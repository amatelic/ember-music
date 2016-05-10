import Ember from 'ember';

export function eq(params/*, hash*/) {
  let cond1 = params[2] || '';
  let cond2 = params[3] || '';
  return params[0] === params[1] ? cond1 : cond2;
}

export default Ember.Helper.helper(eq);
