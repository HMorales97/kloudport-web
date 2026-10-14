/* ---------- Navegación entre secciones ---------- */
const views = ["inicio", "acerca", "preguntas"];

function show() {
  const name = views.includes(location.hash.slice(1)) ? location.hash.slice(1) : "inicio";
  views.forEach(v => { document.getElementById(v).hidden = v !== name; });
  document.querySelectorAll("nav a").forEach(a => {
    if (a.dataset.view === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", show);
show();

/* ---------- Ventana "cómo fue hecha" ---------- */
const dlg = document.getElementById("how");
document.getElementById("open").addEventListener("click", () => dlg.showModal());
document.getElementById("close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

/* ---------- Quiz: 10 preguntas al azar del banco ---------- */
const TOTAL = 10;
const box = document.getElementById("quiz");
let round = [], idx = 0, score = 0;

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function start() {
  round = shuffle(QUESTIONS).slice(0, TOTAL).map(([q, ok, ...bad]) => ({ q, ok, opts: shuffle([ok, ...bad]) }));
  idx = 0; score = 0;
  render();
}

function render() {
  const item = round[idx];
  box.innerHTML = `
    <div class="quiz-top"><span>Pregunta ${idx + 1} de ${TOTAL}</span><span>Aciertos: ${score}</span></div>
    <div class="bar"><div style="width:${(idx / TOTAL) * 100}%"></div></div>
    <p class="q"></p>
    <div class="opts"></div>
    <p class="fb"></p>`;
  box.querySelector(".q").textContent = item.q;
  const opts = box.querySelector(".opts");
  item.opts.forEach(text => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "opt"; b.textContent = text;
    b.addEventListener("click", () => answer(b, text));
    opts.appendChild(b);
  });
}

function answer(btn, text) {
  const item = round[idx];
  const right = text === item.ok;
  if (right) score++;
  box.querySelectorAll(".opt").forEach(b => {
    b.disabled = true;
    if (b.textContent === item.ok) b.classList.add("ok");
  });
  if (!right) btn.classList.add("no");
  box.querySelector(".fb").textContent = right ? "¡Correcto!" : "No es esa. La respuesta correcta está marcada en verde.";
  const next = document.createElement("button");
  next.type = "button"; next.className = "btn";
  next.textContent = idx + 1 < TOTAL ? "Siguiente pregunta" : "Ver resultado";
  next.addEventListener("click", () => { idx++; idx < TOTAL ? render() : finish(); });
  box.appendChild(next);
  next.focus();
}

function finish() {
  const msg = score >= 8 ? "Excelente dominio de los conceptos." : score >= 5 ? "Buen avance, repasa lo que falló." : "Sigue practicando, cada intento ayuda.";
  box.innerHTML = `
    <div class="quiz-top"><span>Resultado</span></div>
    <p class="score">${score} / ${TOTAL}</p>
    <p>${msg}</p>
    <button type="button" class="btn" id="again">Intentar con otras 10 preguntas</button>`;
  document.getElementById("again").addEventListener("click", start);
}

start();
