var Pjs;
var btn = document.getElementById('start');

function moveEnd(){
  location.href = 'end.html';
}

btn.addEventListener('click', function(){
  location.href = 'index.html';
  setTimeout(moveEnd(), 5000);
});
function stop(){ // not work
  if (Pjs)
    Pjs.exit();
}
function run(){
  //console.log("Run");
  stop();
  var canvas = document.getElementById('canvas0');
  var code = editor.getValue(); //aceエディタに入力したコードを取得
  //console.log(code);
  try{
    Pjs = new Processing(canvas, code);
    //console.log(Pjs);
  }catch(e){
    alert(e);
  }
}
