/**
 * 绘制背景
 */

((_document: Document, _window: Window): void=>{
  const background: Element = _document.getElementById('game-background');
  const ctx: CanvasRenderingContext2D = background.getContext('2d');

  /* 绘制线条 */
  function drawAGridLine(): void{
    const w: number = 20;
    const len: number = 20;
    const max: number = w * len;

    ctx.beginPath();
    ctx.strokeStyle = '#eaeaea';
    ctx.lineWidth = 1;

    for(let i: number = 1; i < len; i++){
      const n: number = w * i;
      // 画横线
      ctx.moveTo(0, n);
      ctx.lineTo(max, n);
      ctx.stroke();
      // 画竖线
      ctx.moveTo(n, 0);
      ctx.lineTo(n, max);
      ctx.stroke();
    }
  }

  drawAGridLine();
})(document, window);