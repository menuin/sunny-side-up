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

function addWigglingIncircle(A, B, C) {
  const distance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const a = distance(B, C);
  const b = distance(C, A);
  const c = distance(A, B);
  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  const r = area / s;

  // 기본 incenter
  const incenter = {
    x: (a * A.x + b * B.x + c * C.x) / (a + b + c),
    y: (a * A.y + b * B.y + c * C.y) / (a + b + c),
  };

  // 반지름 기반 가중 이동 (큰 원 쪽으로)
  const totalR = A.r + B.r + C.r;
  const offsetX = (A.x * A.r + B.x * B.r + C.x * C.r) / totalR - incenter.x;
  const offsetY = (A.y * A.r + B.y * B.r + C.y * C.r) / totalR - incenter.y;

  const shiftFactor = 1; // 이동 비율 제한
  const shiftedIncenter = {
    x: incenter.x + offsetX * shiftFactor,
    y: incenter.y + offsetY * shiftFactor,
  };

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", shiftedIncenter.x);
  circle.setAttribute("cy", shiftedIncenter.y);
  circle.setAttribute("r", r);
  circle.setAttribute("stroke", "#fecf3d");
  circle.setAttribute("fill", "#fecf3d");
  circle.setAttribute("stroke-width", 1.5);
  svg.appendChild(circle);
}

const animate = () => {
  svg.innerHTML = ""; // 매 프레임 SVG 초기화

  A.update();
  B.update();
  C.update();

  A.draw(svg);
  B.draw(svg);
  C.draw(svg);

  const AB = place(A, B, { r: 200 });
  const AC = place(C, A, { r: 200 });
  const BC = place(B, C, { r: 200 });

  drawArcPolygon(A, B, AB);
  drawArcPolygon(C, A, AC);
  drawArcPolygon(B, C, BC);
  drawTriangleBetweenCircles(A, B, C);
  addWigglingIncircle(A, B, C);

  requestAnimationFrame(animate);
};
class Circle {
  constructor(x, y, r, dr = 0.5, min = 20, max = 100) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dr = dr; // 반지름 변화량 (양수 or 음수)
    this.min = min;
    this.max = max;
  }

  draw() {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", this.x);
    circle.setAttribute("cy", this.y);
    circle.setAttribute("r", this.r);
    circle.setAttribute("fill", "white");
    svg.appendChild(circle);
  }

  update() {
    this.r += this.dr;
    if (this.r > this.max || this.r < this.min) {
      this.dr *= -1; // 방향 반전
    }
  }
}

const A = new Circle(320, 250, 50, 0.7); // 점점 커졌다 작아짐
const B = new Circle(500, 305, 60, -0.5); // 반대로 작아졌다 커짐
const C = new Circle(400, 400, 70, 0.2); // 느리게 변화

// const C = place(A, B, { r: 50 - Math.cos(Date.now() / 5000) * 14 });

// A.draw();
// B.draw();
// C.draw();

animate(A, B, C);
