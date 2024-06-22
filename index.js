class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

const A = new Circle(120, 150, 50);
const B = new Circle(300, 205, 90);
// const C = place(A, B, { r: 50 - Math.cos(Date.now() / 5000) * 14 });
const C = place(A, B, { r: 70 });
const AC = new Circle(
  (A.r * C.x + C.r * A.x) / (A.r + C.r),
  (A.r * C.y + C.r * A.y) / (A.r + C.r),
  2
);
const BC = new Circle(
  (B.r * C.x + C.r * B.x) / (B.r + C.r),
  (B.r * C.y + C.r * B.y) / (B.r + C.r),
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

document.getElementById("dot-ac").setAttribute("cx", AC.x);
document.getElementById("dot-ac").setAttribute("cy", AC.y);
document.getElementById("dot-ac").setAttribute("r", AC.r);

document.getElementById("dot-bc").setAttribute("cx", BC.x);
document.getElementById("dot-bc").setAttribute("cy", BC.y);
document.getElementById("dot-bc").setAttribute("r", BC.r);

document
  .getElementById("arc")
  .setAttribute("d", `M ${AC.x} ${AC.y} A ${C.r} ${C.r} 0 0 0 ${BC.x} ${BC.y}`);

const compoundPath = `M ${C.x} ${C.y} L ${AC.x} ${AC.y} A ${C.r} ${C.r} 0 0 0 ${BC.x} ${BC.y} Z`;
document.getElementById("shape").setAttribute("d", compoundPath);

// https://observablehq.com/@mbostock/tangent-to-two-circles
function place(a, b, c) {
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
}
