export default function(){
  this.transition(
    this.fromRoute('music'),
    this.toRoute('user'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
};
