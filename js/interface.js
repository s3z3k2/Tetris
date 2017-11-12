function start() {
  // radiobottonの値を取得
  var difficulty = document.getElementsByName('difficulty');
  for (i = 0; i < difficulty.length; i++) {
      if (difficulty[i].checked) {
        speed = difficulty[i].value;
      }
  }
  // index.htmlに移動
  var url = location.href;
  var pathinfo = url.split('/');
  pathinfo.pop();

  var foldername = [];

  for (var i=0; i<pathinfo.length; i++) {
    var foldername = foldername + pathinfo[i] + "/";
  }

  var path = foldername + "index.html";
  location.href = path + "?" + speed;
}
