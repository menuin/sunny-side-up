function drawCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function getPointOnCircle(centerX, centerY, radius, angle) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

function extendPoint(point, center, length) {
  const deltaX = point.x - center.x;
  const deltaY = point.y - center.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  return {
    x: point.x + ((point.x - center.x) / distance) * length,
    y: point.y + ((point.y - center.y) / distance) * length,
  };
}

function fillShapeOutsideCircle(
  ctx,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  lineLength1,
  lineLength2
) {
  const startPoint = getPointOnCircle(centerX, centerY, radius, startAngle);
  const endPoint = getPointOnCircle(centerX, centerY, radius, endAngle);

  const extendedStartPoint = extendPoint(
    startPoint,
    { x: centerX, y: centerY },
    lineLength1
  );
  const extendedEndPoint = extendPoint(
    endPoint,
    { x: centerX, y: centerY },
    lineLength2
  );

  ctx.beginPath();
  ctx.moveTo(extendedStartPoint.x, extendedStartPoint.y);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(extendedEndPoint.x, extendedEndPoint.y);
  ctx.lineTo(extendedStartPoint.x, extendedStartPoint.y);
  ctx.closePath();

  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fill();
  ctx.stroke();
}

window.onload = function () {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 150;
  const lineLength1 = 100; // Length of the first line
  const lineLength2 = 150; // Length of the second line

  drawCircle(ctx, centerX, centerY, radius);

  // Define start and end angles
  const startAngle = Math.random() * 2 * Math.PI;
  const endAngle = startAngle + Math.PI / 2; // 90 degrees arc

  fillShapeOutsideCircle(
    ctx,
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
    lineLength1,
    lineLength2
  );
};
