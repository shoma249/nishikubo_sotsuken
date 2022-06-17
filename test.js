var Pjs;

function stop(){ // not work
  if (Pjs)
    Pjs.exit();
}
function run(){
  //console.log("Run");
  stop();
  var canvas = document.getElementById('canvas0');
  //var code = document.getElementsByName('code')[0].value
  var code = editor.getValue();
  //console.log(code);
  try{
    Pjs = new Processing(canvas, code);
    //console.log(Pjs);
  }catch(e){
    alert(e);
  }
}