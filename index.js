const svg = document.getElementById("svg");

// https://observablehq.com/@mbostock/tangent-to-two-circles
const place = (a, b, c) => {
  const x_ba = b.x - a.x;
  const y_ba = b.y - a.y;
  const l_ab2 = x_ba ** 2 + y_ba ** 2;
  const r_ac2 = (a.r + c.r) ** 2;
  const r_bc2 = (b.r + c.r) ** 2;
  const t_ap = (l_ab2 + r_ac2 - r_bc2) / (2 * l_ab2);
  const t_pc = Math.sqrt(r_ac2 / l_ab2 - t_ap ** 2);
  c.x = a.x + t_ap * x_ba + t_pc * y_ba;
  c.y = a.y + t_ap * y_ba - t_pc * x_ba;
  return c;
};

const drawArcPolygon = (A, B, AB) => {
  // A_AB, B_AB 계산
  const A_AB = {
    x: (A.r * AB.x + AB.r * A.x) / (A.r + AB.r),
    y: (A.r * AB.y + AB.r * A.y) / (A.r + AB.r),
  };

  const B_AB = {
    x: (B.r * AB.x + AB.r * B.x) / (B.r + AB.r),
    y: (B.r * AB.y + AB.r * B.y) / (B.r + AB.r),
  };

  // SVG path 데이터
  const pathData = `
    M ${A.x} ${A.y}
    L ${A_AB.x} ${A_AB.y}
    A ${AB.r} ${AB.r} 0 0 0 ${B_AB.x} ${B_AB.y}
    L ${B.x} ${B.y}
    Z
  `;

  // path 엘리먼트 생성
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData.trim());
  path.setAttribute("fill", "white");
  path.setAttribute("stroke", "none");
  path.setAttribute("opacity", 1); // 또는 fill-opacity

  svg.appendChild(path);
};

const drawTriangleBetweenCircles = (A, B, C) => {
  const points = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`;
  const polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  polygon.setAttribute("points", points);
  polygon.setAttribute("fill", "white");
  polygon.setAttribute("stroke", "white");
  polygon.setAttribute("opacity", 1); // 또는 fill-opacity

  svg.appendChild(polygon);
};

const addIncircleToTriangle = (A, B, C) => {
  // 거리 계산 함수
  const distance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

  // 삼각형 변 길이
  const a = distance(B, C);
  const b = distance(C, A);
  const c = distance(A, B);

  // 둘레의 절반 (semi-perimeter)
  const s = (a + b + c) / 2;

  // 내접원의 중심 (incenter)
  const incenter = {
    x: (a * A.x + b * B.x + c * C.x) / (a + b + c),
    y: (a * A.y + b * B.y + c * C.y) / (a + b + c),
  };

  // 내접원의 반지름 (inradius)
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c)); // Heron's formula
  const r = area / s;

  // SVG circle 추가
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", incenter.x);
  circle.setAttribute("cy", incenter.y);
  circle.setAttribute("r", r);
  circle.setAttribute("stroke", "#fecf3d");
  circle.setAttribute("fill", "#fecf3d");
  circle.setAttribute("stroke-width", 1.5);
  svg.appendChild(circle);
};

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

const A = new Circle(320, 250, 50);
const B = new Circle(500, 305, 50);
const C = new Circle(400, 400, 90);
// const C = place(A, B, { r: 50 - Math.cos(Date.now() / 5000) * 14 });
const AB = place(A, B, { r: 200 });
const AC = place(C, A, { r: 200 });
const BC = place(B, C, { r: 200 });
const A_AB = new Circle(
  (A.r * AB.x + AB.r * A.x) / (A.r + AB.r),
  (A.r * AB.y + AB.r * A.y) / (A.r + AB.r),
  2
);
const B_AB = new Circle(
  (B.r * AB.x + AB.r * B.x) / (B.r + AB.r),
  (B.r * AB.y + AB.r * B.y) / (B.r + AB.r),
  2
);

document.getElementById("circle-a").setAttribute("cx", A.x);
document.getElementById("circle-a").setAttribute("cy", A.y);
document.getElementById("circle-a").setAttribute("r", A.r);

document.getElementById("circle-b").setAttribute("cx", B.x);
document.getElementById("circle-b").setAttribute("cy", B.y);
document.getElementById("circle-b").setAttribute("r", B.r);

document.getElementById("circle-c").setAttribute("cx", C.x);
document.getElementById("circle-c").setAttribute("cy", C.y);
document.getElementById("circle-c").setAttribute("r", C.r);

document.getElementById("circle-ab").setAttribute("cx", AB.x);
document.getElementById("circle-ab").setAttribute("cy", AB.y);
document.getElementById("circle-ab").setAttribute("r", AB.r);

document.getElementById("circle-ac").setAttribute("cx", AC.x);
document.getElementById("circle-ac").setAttribute("cy", AC.y);
document.getElementById("circle-ac").setAttribute("r", AC.r);

document.getElementById("circle-bc").setAttribute("cx", BC.x);
document.getElementById("circle-bc").setAttribute("cy", BC.y);
document.getElementById("circle-bc").setAttribute("r", BC.r);

document.getElementById("dot-a_ab").setAttribute("cx", A_AB.x);
document.getElementById("dot-a_ab").setAttribute("cy", A_AB.y);
document.getElementById("dot-a_ab").setAttribute("r", A_AB.r);

document.getElementById("dot-b_ab").setAttribute("cx", B_AB.x);
document.getElementById("dot-b_ab").setAttribute("cy", B_AB.y);
document.getElementById("dot-b_ab").setAttribute("r", B_AB.r);

document
  .getElementById("arc")
  .setAttribute(
    "d",
    `M ${A_AB.x} ${A_AB.y} A ${AB.r} ${AB.r} 0 0 0 ${B_AB.x} ${B_AB.y}`
  );

drawArcPolygon(A, B, AB);
drawArcPolygon(C, A, AC);
drawArcPolygon(B, C, BC);
drawTriangleBetweenCircles(A, B, C);
addIncircleToTriangle(A, B, C);
