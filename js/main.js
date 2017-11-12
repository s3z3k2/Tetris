// 左回転 : OK
// ブロック固定の時間
// ブロックのランダム性 : OK
// インターフェイス : OK
// 難易度設定 : OK
// 得点表示 : OK
// 得点倍率 : OK
// ネクストブロック : OK
// GameOver後のブロックストップ : OK
// 回転時の押し出し
// 上ボタン
// 終了時のエフェクト : OK
// 落下速度 : OK
// 最終ブロック排出時のバグ解消 : OK
// 下ボタン押し続け時のバグ解消
var MinoCount = 0;
var DeleteCount = 0;
var generate_var = 0;
var fall_var = 0;
var endvar = 1;
var blockhistory = [];
// var interval = 500;
var interval_var = 1;
var non_init = false;

var cells;
var cellsnext;
var rot_row;
var rot_col;

// ブロックのパターン
var blocks = {
  j: {
    class: "j",
    pattern: [
      [1, 0, 0],
      [1, 1, 1]
    ]
  },
  l: {
    class: "l",
    pattern: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  },
  t: {
    class: "t",
    pattern: [
      [0, 1, 0],
      [1, 1, 1]
    ]
  },
  i: {
    class: "i",
    pattern: [
      [1, 1, 1, 1]
    ]
  },
  o: {
    class: "o",
    pattern: [
      [1, 1],
      [1, 1]
    ]
  },
  s: {
    class: "s",
    pattern: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  },
  z: {
    class: "z",
    pattern: [
      [1, 1, 0],
      [0, 1, 1]
    ]
  }
};

loadTable();

var timer_id;
var speed = parseInt( location.search.substring(1), 10 );

// 1秒毎に見出しを変更
var main = function() {
  timer_id  = setTimeout("main()", speed);
  if (endvar === -1) {
    // 終了時のエフェクト
    setTimeout("endeffect(0)",4000);
    setTimeout("endeffect(1)",3800);
    setTimeout("endeffect(2)",3600);
    setTimeout("endeffect(3)",3400);
    setTimeout("endeffect(4)",3200);
    setTimeout("endeffect(5)",3000);
    setTimeout("endeffect(6)",2800);
    setTimeout("endeffect(7)",2600);
    setTimeout("endeffect(8)",2400);
    setTimeout("endeffect(9)",2200);
    setTimeout("endeffect(10)",2000);
    setTimeout("endeffect(11)",1800);
    setTimeout("endeffect(12)",1600);
    setTimeout("endeffect(13)",1400);
    setTimeout("endeffect(14)",1200);
    setTimeout("endeffect(15)",1000);
    setTimeout("endeffect(16)", 800);
    setTimeout("endeffect(17)", 600);
    setTimeout("endeffect(18)", 400);
    setTimeout("endeffect(19)", 200);

    var result = setTimeout(function(){
      if (score < 100) {
        alert("たいしたことないですね。" + "\n" + "合計得点は" + score  + "点です");
      } else if (score < 1000) {
        alert("まぁまぁですね。" + "\n" + "合計得点は" + score  + "点です");
      } else {
        alert("かないませんわ!" + "\n" + "合計得点は" + score  + "点です");
      }
    },4200);

    clearTimeout(timer_id);
  }

  document.getElementById("Level").textContent = "Level       :" + interval_var;
  document.getElementById("Mino").textContent = "Mino Bonus  :" + MinoCount;
  document.getElementById("Delete").textContent = "Delete Bonus:" + DeleteCount;
  var score = MinoCount + DeleteCount;
  document.getElementById("Score").textContent = "Total Score :" + score;

  // 得点に応じて落下速度の変化
  if (score > 25 * interval_var) {
    speed = speed / 1.2;
    interval_var++;
  }
  // ブロックが積み上がっていないかの確認
  if (generate_var === 1 && fall_var === 1) {
    endvar = -1;
  }

  fall_var = 0;
  if (non_init === true && endvar !== -1) {
  if (hasFallingBlock()) {
    fallBlocks();
  } else {
    deleteRow();
    generateBlock();
  }
  }
  non_init = true;

};

main();

// 終了時のエフェクト
function endeffect(endrow) {
  var endkeys = Object.keys(blocks);
  var endBlockKey = endkeys[Math.floor(Math.random() * endkeys.length)];
  var endBlock = blocks[endBlockKey];
  for (var tmp=0; tmp<10; tmp++) {
    cells[endrow][tmp].className = endBlock.class;
  }
}

// 関数の宣言部分----------------------------------------
function loadTable() {
  cells = [];
  // tdを取得
  var td_array = document.getElementsByTagName("td");
  var index = 0;
  // tdを二次元配列に変換
  for (var row = 0; row < 20; row++) {
    cells[row] = [];
    for (var col = 0; col < 10; col++) {
      cells[row][col] = td_array[index];
      index++;
    }
  }
  cellsnext = [];

  for (var row = 0; row < 5; row++) {
    cellsnext[row] = [];
    for (var col = 0; col < 5; col++) {
      cellsnext[row][col] = td_array[index];
      index++;
    }
  }

}

function fallBlocks() {
  // 底についていないか？
  for (var col = 0; col < 10; col++) {
    if (cells[19][col].blockNum === FallingBlockNum) {
      isFalling = false;
      return;
    }
  }

  // １マス下に別のブロックがないか？
  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === FallingBlockNum) {
        if (cells[row + 1][col].className !== "" && cells[row + 1][col].blockNum !== FallingBlockNum) {
          isFalling = false;
          fall_var = 1;
          return;
        }
      }
    }
  }

  // 下から二番目の行から繰り返しクラスを下げていく
  for (var row = 18; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === FallingBlockNum) {
        cells[row + 1][col].className = cells[row][col].className;
        cells[row + 1][col].blockNum = cells[row][col].blockNum;
        cells[row][col].className = "";
        cells[row][col].blockNum = null;
      }
    }
  }
  generate_var = 0;
}

var isFalling = false;
function hasFallingBlock() {
  // 落下中のブロックがあるか確認する
  return isFalling;
}

function deleteRow() {
  var combo = 0;
  // 揃っている行を消す
  for (var row = 19; row >= 0; row--) {
    var canDelete = true;
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].className === "") {
        canDelete = false;
      }
    }
    if (canDelete) {
      combo++;
      // 1行消す
      for (var col = 0; col < 10; col++) {
        cells[row][col].className = "";
      }
    // 1行落とす
      for (var downRow = row - 1; downRow >= 0; downRow--) {
        for (var col = 0; col < 10; col++) {
          cells[downRow + 1][col].className = cells[downRow][col].className;
          cells[downRow + 1][col].blockNum = cells[downRow][col].blockNum;
          cells[downRow][col].className = "";
          cells[downRow][col].blockNum = null;
        }
      }
    row++;
    }
  }
  DeleteCount = DeleteCount + (combo * 3) ** 2;
}

var FallingBlockNum = 0;
function generateBlock() {
  var display = true;
  FallingBlockNum++;
  // ブロックパターンからランダムに１つパターンを選ぶ
  var keys = Object.keys(blocks);
  // 初回のみ"j","l","t"から選択する
  if (FallingBlockNum === 1) {
    var nextBlockKey = keys[Math.floor(Math.random() * 3)];
    var nextBlock = blocks[nextBlockKey];
    blockhistory = blockhistory + nextBlock.class;
  }
  // 直近4回で生成されたブロック以外を生成（6回再生成しても重複したら終了）
  for (var history = 0; history <= 6; history++) {
    var next2BlockKey = keys[Math.floor(Math.random() * keys.length)];
    var next2Block = blocks[next2BlockKey];
    if (blockhistory.indexOf(next2Block.class) === -1) {
      history = 7;
    }
  }
  // 選んだパターンを元にブロックを配置する
  if (FallingBlockNum === 1) {
    var pattern = nextBlock.pattern;
    for (var row = 0; row < pattern.length; row++) {
      for (var col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col]) {
          cells[row][col + 3].className = nextBlock.class;
          cells[row][col + 3].blockNum = FallingBlockNum;
        }
      }
    }
  } else {
    // ネクストスペースに表示
    var check = 0;
    for (check = 0; check <= 25; check++) {
      for (var row = 0; row <= 4; row++) {
        for (var col = 0; col <= 4; col++) {
          if (cellsnext[row][col].className !== "") {
            var checkrow = row;
            var checkcol = col;
          }
        }
      }
    }
    // 表示可能性の判断
    var pattern = blocks[cellsnext[checkrow][checkcol].className].pattern;

    for (var row = 0; row < pattern.length; row++) {
      for (var col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col]) {
          if (cells[row][col + 3].className !== "") {
            display = false;
            fall_var = 1;
          }
        }
      }
    }

    if (display) {
      for (var row = 0; row < pattern.length; row++) {
        for (var col = 0; col < pattern[row].length; col++) {
          if (pattern[row][col]) {
            cells[row][col + 3].className = cellsnext[checkrow][checkcol].className;
            cells[row][col + 3].blockNum = FallingBlockNum;
          }
        }
      }
    }
  }

  if (display) {
    // nextスペースのclear
    for (var row = 0; row <= 4; row++) {
      for (var col = 0; col <= 4; col ++) {
        cellsnext[row][col].className = "";
        cellsnext[row][col].blockNum = null;
      }
    }
    // 次に落ちる予定のブロックを表示
    var pattern = next2Block.pattern;
    for (var row = 0; row < pattern.length; row++) {
      for (var col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col]) {
          cellsnext[row + 2][col + 1].className = next2Block.class;
          cellsnext[row + 2][col + 1].blockNum = FallingBlockNum + 1;
        }
      }
    }
  }
  // 落下中のブロックがあるとする
  isFalling = true;
  generate_var = 1;
  MinoCount++;
  rotation = 1;
  blockhistory = blockhistory + next2Block.class;
  if (blockhistory.length > 4) {
    blockhistory = blockhistory.substring(1);
  }
}
// キーボードイベントを監視する
document.addEventListener("keydown", onKeyDown);

// キー入力によってそれぞれの関数を呼び出す
function onKeyDown(event) {
  if (event.keyCode === 37) {
    moveLeft();
  } else if (event.keyCode === 39) {
    moveRight();
  } else if (event.keyCode === 40) {
    moveBelow();
  } else if (event.keyCode === 68) {
    rotationRight();
  } else if (event.keyCode === 65) {
    rotationLeft();
  }
}

function ReStart() {
  window.location.reload();
}

function TopPage() {
  var url = location.href;
  var pathinfo = url.split('/');
  pathinfo.pop();

  var foldername = [];

  for (var i=0; i<pathinfo.length; i++) {
    var foldername = foldername + pathinfo[i] + "/";
  }
  location.href = foldername + "interface.html";
}

function moveRight() {
  // 移動可能条件の判定
  var movable = true;
  for (var row = 0; row < 20; row++) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === FallingBlockNum) {
        if (cells[row][col + 1].className !== "" &&
            cells[row][col + 1].blockNum !== FallingBlockNum) {
          movable = false;
        }
      }
    }
  }
  if (movable) {
    // ブロックを右に移動させる
    for (var row = 0; row < 20; row++) {
      for (var col = 9; col >= 0; col--) {
        if (cells[row][col].blockNum === FallingBlockNum) {
          cells[row][col + 1].className = cells[row][col].className;
          cells[row][col + 1].blockNum = cells[row][col].blockNum;
          cells[row][col].className = "";
          cells[row][col].blockNum = null;
        }
      }
    }
  }
}

function moveLeft() {
  // 移動可能条件の判定
  var movable = true;
  for (var row = 0; row < 20; row++) {
    for (var col = 9; col >= 0; col--) {
      if (cells[row][col].blockNum === FallingBlockNum) {
        if (cells[row][col - 1].className !== "" &&
            cells[row][col - 1].blockNum !== FallingBlockNum) {
          movable = false;
        }
      }
    }
  }
  if (movable) {
    // ブロックを左に移動させる
    for (var row = 0; row < 20; row++) {
      for (var col = 0; col < 10; col++) {
        if (cells[row][col].blockNum === FallingBlockNum) {
          cells[row][col - 1].className = cells[row][col].className;
          cells[row][col - 1].blockNum = cells[row][col].blockNum;
          cells[row][col].className = "";
          cells[row][col].blockNum = null;
        }
      }
    }
  }
}

function moveBelow() {
  // 移動可能条件の判定
  movable = true;
  // 底についていないか？
  for (var col = 0; col < 10; col++) {
    if (cells[19][col].blockNum === FallingBlockNum) {
      movable = false;
    }
  }
  // 下に他のブロックがないか
  for (var row = 0; row < 19; row++) {
    for (var col = 9; col >= 0; col--) {
      if (cells[row][col].blockNum === FallingBlockNum) {
        if (cells[row + 1][col].className !== "" &&
            cells[row + 1][col].blockNum !== FallingBlockNum) {
          movable = false;
        }
      }
    }
  }
  if (movable) {
    // ブロックを下に移動させる
    for (var row = 18; row >= 0; row--) {
      for (var col = 0; col < 10; col++) {
        if (cells[row][col].blockNum === FallingBlockNum) {
          cells[row + 1][col].className = cells[row][col].className;
          cells[row + 1][col].blockNum = cells[row][col].blockNum;
          cells[row][col].className = "";
          cells[row][col].blockNum = null;
        }
      }
    }
  }
}

function rotation_centor() {
  // 落下ブロックの左下セル番地を取得
  rot_row = -1;
  rot_col = -1;

  for (var row = 19; row >= 0; row--) {
    for (var col = 0; col < 10; col++) {
      if (cells[row][col].blockNum === FallingBlockNum) {
        if (rot_row === -1 && rot_col === -1) {
          rot_row = row;
          rot_col = col;
        }
      }
    }
  }
}

// 右回転
function rotationRight() {
  rotation_centor();
  var movable = true;
  rot_class = cells[rot_row][rot_col].className;
  rot_num = cells[rot_row][rot_col].blockNum;

  // iブロックの回転
  if (rot_class === "i") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 2].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 2].className !== "") {
        movable = false;
      } else if (cells[rot_row - 3][rot_col + 2].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 2].className = rot_class;
        cells[rot_row - 2][rot_col + 2].className = rot_class;
        cells[rot_row - 3][rot_col + 2].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row][rot_col + 3].className = "";
        cells[rot_row - 1][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 3][rot_col + 2].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row][rot_col + 3].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 2].className !== "") {
        movable = false;
        }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 2].className = rot_class;
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 3][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        cells[rot_row - 3][rot_col].blockNum = null;
        rotation = 3;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 2].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 2].className !== "") {
        movable = false;
      } else if (cells[rot_row - 3][rot_col + 2].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 2].className = rot_class;
        cells[rot_row - 2][rot_col + 2].className = rot_class;
        cells[rot_row - 3][rot_col + 2].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row][rot_col + 3].className = "";
        cells[rot_row - 1][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 3][rot_col + 2].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row][rot_col + 3].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 2].className !== "") {
        movable = false;
        }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 2].className = rot_class;
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 3][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        cells[rot_row - 3][rot_col].blockNum = null;
        rotation = 1;
      }
    }
  } else if (rot_class === "t") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 2].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 2].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 2].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = null;
        rotation = 3;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = "";
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        rotation = 1;
      }
    }
  } else if (rot_class === "s") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col].className = rot_class;
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col + 2].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 2][rot_col - 1].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        cells[rot_row - 2][rot_col - 1].blockNum = null;
        rotation = 3;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col].className = rot_class;
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col + 2].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 2][rot_col - 1].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        cells[rot_row - 2][rot_col - 1].blockNum = null;
        rotation = 1;
      }
    }
  } else if (rot_class === "z") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = "";
        cells[rot_row - 2][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = null;
        cells[rot_row - 2][rot_col + 1].blockNum = null;
        rotation = 3;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = "";
        cells[rot_row - 2][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = null;
        cells[rot_row - 2][rot_col + 1].blockNum = null;
        rotation = 1;
      }
    }
  } else if (rot_class === "j") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 2][rot_col + 2].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 2].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 2].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 2].blockNum = null;
        cells[rot_row - 1][rot_col].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 2][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col + 1].blockNum = null;
        rotation = 3;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col - 2].className !== "") {
        movable = false;
      } else if (cells[rot_row - 2][rot_col - 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col - 2].className = rot_class;
        cells[rot_row - 2][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col - 2].className = "";
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col - 2].blockNum = rot_num;
        cells[rot_row - 2][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col - 2].blockNum = null;
        cells[rot_row - 1][rot_col].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col + 2].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col].className = rot_class;
        cells[rot_row][rot_col + 2].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = "";
        cells[rot_row - 2][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col].blockNum = rot_num;
        cells[rot_row][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = null;
        cells[rot_row - 2][rot_col + 1].blockNum = null;
        rotation = 1;
      }
    }
  } else if (rot_class === "l") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col + 2].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        rotation = 3;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 1][rot_col + 2].className = "";
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col + 2].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 2][rot_col - 1].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col - 1].blockNum = null;
        rotation = 1;
      }
    }
  }
}

// 右回転
function rotationLeft() {
  rotation_centor();
  var movable = true;
  rot_class = cells[rot_row][rot_col].className;
  rot_num = cells[rot_row][rot_col].blockNum;

  // iブロックの回転
  if (rot_class === "i") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 2].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 2].className !== "") {
        movable = false;
      } else if (cells[rot_row - 3][rot_col + 2].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 2].className = rot_class;
        cells[rot_row - 2][rot_col + 2].className = rot_class;
        cells[rot_row - 3][rot_col + 2].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row][rot_col + 3].className = "";
        cells[rot_row - 1][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 3][rot_col + 2].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row][rot_col + 3].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 2].className !== "") {
        movable = false;
        }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 2].className = rot_class;
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 3][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        cells[rot_row - 3][rot_col].blockNum = null;
        rotation = 1;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 2].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 2].className !== "") {
        movable = false;
      } else if (cells[rot_row - 3][rot_col + 2].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 2].className = rot_class;
        cells[rot_row - 2][rot_col + 2].className = rot_class;
        cells[rot_row - 3][rot_col + 2].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row][rot_col + 3].className = "";
        cells[rot_row - 1][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 3][rot_col + 2].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row][rot_col + 3].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 2].className !== "") {
        movable = false;
        }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 2].className = rot_class;
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 3][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        cells[rot_row - 3][rot_col].blockNum = null;
        rotation = 3;
      }
    }
  } else if (rot_class === "t") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 2].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        rotation = 1;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = null;
        rotation = 3;
      }
    }
  } else if (rot_class === "s") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col].className = rot_class;
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col + 2].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 2][rot_col - 1].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        cells[rot_row - 2][rot_col - 1].blockNum = null;
        rotation = 1;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col].className = rot_class;
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col + 2].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 2][rot_col - 1].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        cells[rot_row - 2][rot_col - 1].blockNum = null;
        rotation = 3;
      }
    }
  } else if (rot_class === "z") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = "";
        cells[rot_row - 2][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = null;
        cells[rot_row - 2][rot_col + 1].blockNum = null;
        rotation = 1;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = null;
        cells[rot_row - 1][rot_col - 1].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = "";
        cells[rot_row - 2][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = null;
        cells[rot_row - 2][rot_col + 1].blockNum = null;
        rotation = 3;
      }
    }
  } else if (rot_class === "j") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 2].blockNum = null;
        cells[rot_row - 1][rot_col].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 2][rot_col + 1].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col + 1].blockNum = null;
        rotation = 1;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      } else if (cells[rot_row - 2][rot_col - 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row - 2][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col - 2].className = "";
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row - 2][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col - 2].blockNum = null;
        cells[rot_row - 1][rot_col].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 2][rot_col + 1].className = "";
        cells[rot_row - 1][rot_col].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col + 1].blockNum = null;
        rotation = 3;
      }
    }
  } else if (rot_class === "l") {
    if (rotation === 1) {
      // 回転可能かの判定
      if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 2][rot_col].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row - 2][rot_col].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col + 2].className = "";
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 2][rot_col].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row][rot_col + 2].blockNum = null;
        cells[rot_row - 1][rot_col + 2].blockNum = null;
        rotation = 4;
      }
    } else if (rotation === 2) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      } else if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        rotation = 1;
      }
    } else if (rotation === 3) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col + 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row][rot_col + 2].className !== "") {
        movable = false;
      } else if (cells[rot_row - 2][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col + 2].className = rot_class;
        cells[rot_row - 2][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 1][rot_col].className = "";
        cells[rot_row - 1][rot_col + 2].className = "";
        cells[rot_row][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col + 2].blockNum = rot_num;
        cells[rot_row - 2][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col].blockNum = null;
        cells[rot_row - 1][rot_col + 2].blockNum = null;
        rotation = 2;
      }
    } else if (rotation === 4) {
      // 回転可能かの判定
      if (cells[rot_row][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 1][rot_col - 1].className !== "") {
        movable = false;
      }  else if (cells[rot_row - 1][rot_col + 1].className !== "") {
        movable = false;
      }
      // 回転の実行
      if (movable === true) {
        cells[rot_row][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col - 1].className = rot_class;
        cells[rot_row - 1][rot_col + 1].className = rot_class;
        cells[rot_row][rot_col].className = "";
        cells[rot_row - 2][rot_col].className = "";
        cells[rot_row - 2][rot_col - 1].className = "";
        cells[rot_row][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col - 1].blockNum = rot_num;
        cells[rot_row - 1][rot_col + 1].blockNum = rot_num;
        cells[rot_row][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col].blockNum = null;
        cells[rot_row - 2][rot_col - 1].blockNum = null;
        rotation = 3;
      }
    }
  }
}
