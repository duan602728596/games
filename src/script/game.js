/**
 * 游戏逻辑
 */

((_document: Document, _window: Window): void=>{
  const area: Element = _document.getElementById('game-area');
  const ctx: CanvasRenderingContext2D = area.getContext('2d');
  const newGame: Element = _document.getElementById('new-game');
  const gamePause: Element = _document.getElementById('game-pause');
  const long: Element = _document.getElementById('long');

  const width: number = 20;
  const len: number = 20;
  const speed: number = 240;

  // 蛇的身子
  let snakeBody: Array<[number, number]> = [];
  // 食物的坐标
  let food: ?[number, number] = null;
  // 方向
  let direction: number = 0;  // 37：左，38：上，39：右，40：下，0：停止
  // 蛇行走的定时器
  let snakeTimer: ?number = null;
  // 食物的定时器
  let foodTimer: ?number = null;

  /* ========== 绑定事件 ========== */

  /* 键盘事件 */
  function onChangeDirection(event: Event): void{
    direction = event.keyCode;
  }

  _document.addEventListener('keydown', onChangeDirection, false);

  /* 暂停 */
  function onPauseGame(event: Event): void{
    alert('暂停');
  }

  gamePause.addEventListener('click', onPauseGame, false);

  /* ========== 计算 ========== */

  /* 随机坐标，且不在X和Y数组内 */
  function randomCoordinate(): [number, number]{
    const coor: [?number, ?number] = [null, null];
    while(!coor[0] && !coor[1]){
      const x: number = Math.floor(Math.random() * len);
      const y: number = Math.floor(Math.random() * len);

      if(!isInSnakeBody([x, y], 0, snakeBody.length - 1)){
        coor[0] = x;
        coor[1] = y;
      }
    }
    return coor;
  }

  /* 判断坐标是否在蛇的坐标里 */
  function isInSnakeBody(coor: [number, number], from: number, to: number): boolean{
    if(snakeBody.length === 0){
      return false;
    }

    if(from === to){
      const item: [number, number] = snakeBody[from];
      return (coor[0] === item[0]) && (coor[1] === item[1]);
    }

    const middle: number = Math.floor((to - from) / 2) + from;
    const left: boolean = isInSnakeBody(coor, from, middle);
    const right: boolean = isInSnakeBody(coor, middle + 1, to);
    return left || right;
  }

  /* ========== 食物 ========== */

  /* 绘制食物 */
  function drawFood(): void{
    food = randomCoordinate();
    ctx.fillStyle = '#f00';
    ctx.fillRect(width * food[0], width * food[1], width, width);
  }

  /* 清除食物 */
  function clearFood(): void{
    ctx.clearRect(width * food[0], width * food[1], width, width);
    createFood();
  }

  /* 创建食物，并在12s后清除食物 */
  function createFood(): void{
    drawFood();
    foodTimer = setTimeout(clearFood, 12000);
  }

  /* ========== 蛇 ========== */

  /* 画蛇头 */
  function snakeHead(): void{
    ctx.fillStyle = '#00f';
    ctx.fillRect(width * snakeBody[0][0], width * snakeBody[0][1], width, width);
  }
  
  /* 去蛇尾 */
  function snakeTail(): void{
    const tl: number = snakeBody.length - 1;

    ctx.clearRect(width * snakeBody[tl][0], width * snakeBody[tl][1], width, width);
    snakeBody.splice(tl, 1);
  }

  /* 蛇的运动 */
  function snakeMove(): void{
    if(direction === 0){
      snakeTimer = setTimeout(snakeMove, speed);
      return void 0;
    }
    let newX: number = snakeBody[0][0];
    let newY: number = snakeBody[0][1];
    switch(direction){
      case 37:
        newX -= 1;
        break;
      case 38:
        newY -= 1;
        break;
      case 39:
        newX += 1;
        break;
      case 40:
        newY += 1;
        break;
    }

    // 判断是否撞墙
    if(newX < 0 || newY > len - 1 || newY < 0 || newY > len - 1){
      alert('你死了。');
      clearTimeout(foodTimer);
      clearTimeout(snakeTimer);
      return void 0;
    }

    // 判断是否撞上了自己
    if(isInSnakeBody([newX, newY], 0, snakeBody.length - 1)){
      alert('你死了');
      clearTimeout(foodTimer);
      clearTimeout(snakeTimer);
      return void 0;
    }

    // 判断是否吃了食物
    if(newX === food[0] && newY === food[1]){
      long.innerHTML = snakeBody.length + 1;
      clearTimeout(foodTimer);
      createFood();
    }else{
      snakeTail();
    }

    // 画蛇头
    snakeBody.unshift([newX, newY]);
    snakeHead();

    snakeTimer = setTimeout(snakeMove, speed);
  }

  /*** 初始化函数 ***/
  function init(): void{
    clearTimeout(foodTimer);
    clearTimeout(snakeTimer);

    snakeBody = [];
    food = [];
    direction = 0;
    snakeTimer = null;
    foodTimer = null;
    long.innerHTML = 1;
    ctx.clearRect(0, 0, width * len, width * len);

    createFood();

    const cr: [number, number] = randomCoordinate();
    snakeBody.unshift(cr);
    snakeHead();
    snakeMove();
  }

  newGame.addEventListener('click', init, false);
})(document, window);