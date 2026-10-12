/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

// FECHA DEL PLAN
const FECHA_OBJETIVO = new Date('2026-10-17T00:00:00');

// Símbolos neutros para el fondo
const SIMBOLOS_PARTICULAS = ['❤', '✦', '❥', '✧', '♡'];
const CANTIDAD_PARTICULAS = 16;

// Símbolos para el estallido de la pista final
const SIMBOLOS_ESTALLIDO = ['✦', '✧', '❥', '♡', '·'];

/* =========================================================
   REFERENCIAS AL DOM
   ========================================================= */
const seccionPregunta    = document.getElementById('seccion-pregunta');
const seccionSi          = document.getElementById('seccion-si');
const seccionNo          = document.getElementById('seccion-no');
const btnSi              = document.getElementById('btn-si');
const btnNo              = document.getElementById('btn-no');
const btnVolverDesdeSi   = document.getElementById('btn-volver-desde-si');
const btnIntentarOtroDia = document.getElementById('btn-intentar-otro-dia');

const diasRestantesSpan   = document.getElementById('dias-restantes');
const diasRestantesSiSpan = document.getElementById('dias-restantes-si');

const tarjetasPista = document.querySelectorAll('.pista-card');
const pistaFinal    = document.getElementById('pista-final');
const progresoBarra = document.getElementById('progreso-barra');
const TOTAL_PISTAS  = tarjetasPista.length;
const descubiertas  = new Set();

/* =========================================================
   NAVEGACIÓN
   ========================================================= */
function mostrarSeccion(nombre) {
  seccionPregunta.classList.remove('activa');
  seccionSi.classList.remove('activa');
  seccionNo.classList.remove('activa');

  setTimeout(() => {
    if (nombre === 'pregunta') seccionPregunta.classList.add('activa');
    if (nombre === 'si')       seccionSi.classList.add('activa');
    if (nombre === 'no')       seccionNo.classList.add('activa');
  }, 30);
}

btnSi.addEventListener('click', () => {
  mostrarSeccion('si');
  crearDestelloCorazones();
  // Reiniciar animación de aparición de tarjetas
  tarjetasPista.forEach((card, i) => {
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
  });
});

btnNo.addEventListener('click', () => mostrarSeccion('no'));

btnVolverDesdeSi.addEventListener('click', () => {
  mostrarSeccion('pregunta');
  reiniciarPistas();
});

btnIntentarOtroDia.addEventListener('click', () => {
  mostrarSeccion('pregunta');
});

/* =========================================================
   CONTADOR
   ========================================================= */
function actualizarContador() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const objetivo = new Date(FECHA_OBJETIVO);
  objetivo.setHours(0, 0, 0, 0);

  const dias = Math.ceil((objetivo - hoy) / (1000 * 60 * 60 * 24));

  let texto;
  if (dias > 1)        texto = dias;
  else if (dias === 1) texto = '1';
  else if (dias === 0) texto = 'hoy';
  else                 texto = 'pasaron, pero podemos repetir';

  if (diasRestantesSpan)   diasRestantesSpan.textContent = texto;
  if (diasRestantesSiSpan) diasRestantesSiSpan.textContent = texto;
}

actualizarContador();
setInterval(actualizarContador, 3600000);

/* =========================================================
   PARTÍCULAS DE FONDO
   ========================================================= */
function crearParticulas() {
  for (let i = 0; i < CANTIDAD_PARTICULAS; i++) {
    const p = document.createElement('div');
    p.className = 'particula';
    p.textContent = SIMBOLOS_PARTICULAS[Math.floor(Math.random() * SIMBOLOS_PARTICULAS.length)];
    p.style.color = '#c98b76';
    p.style.left = (Math.random() * 100) + 'vw';
    p.style.top  = (Math.random() * 100) + 'vh';
    p.style.fontSize = (0.7 + Math.random() * 1.1) + 'rem';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.animationDuration = (15 + Math.random() * 15) + 's';
    p.style.opacity = 0.1 + Math.random() * 0.2;
    document.body.appendChild(p);
  }
}

/* =========================================================
   DESTELLO DE CORAZONES
   ========================================================= */
function crearDestelloCorazones() {
  for (let i = 0; i < 12; i++) {
    const c = document.createElement('div');
    c.className = 'corazon-destello';
    c.textContent = Math.random() > 0.5 ? '❤' : '✦';
    c.style.color = Math.random() > 0.5 ? '#d97b63' : '#e2a98d';

    const x = window.innerWidth / 2 + (Math.random() - 0.5) * 140;
    const y = window.innerHeight / 2 + (Math.random() - 0.5) * 140;

    c.style.left = x + 'px';
    c.style.top  = y + 'px';
    c.style.fontSize = (1 + Math.random() * 1.8) + 'rem';
    c.style.transform = 'translate(-50%, -50%) scale(0.4)';

    document.body.appendChild(c);
    void c.offsetWidth;

    c.style.transform = `translate(calc(-50% + ${(Math.random() - 0.5) * 260}px), calc(-50% - ${120 + Math.random() * 200}px)) scale(1.2)`;
    c.style.opacity = '0';

    setTimeout(() => c.remove(), 1400);
  }
}

/* =========================================================
   ESTALLIDO DE PARTÍCULAS (al tocar la pista final)
   ========================================================= */
function estallidoParticulas(x, y) {
  const cantidad = 14;
  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement('div');
    p.className = 'estallido';
    p.textContent = SIMBOLOS_ESTALLIDO[Math.floor(Math.random() * SIMBOLOS_ESTALLIDO.length)];
    p.style.color = Math.random() > 0.5 ? '#d97b63' : '#e2a98d';
    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    p.style.transition = 'transform 1.1s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 1.1s ease-out';
    p.style.transform = 'translate(-50%, -50%) scale(0.4)';
    p.style.opacity = '1';

    document.body.appendChild(p);
    void p.offsetWidth;

    const angulo = (Math.PI * 2 * i) / cantidad + Math.random() * 0.4;
    const distancia = 80 + Math.random() * 120;
    const dx = Math.cos(angulo) * distancia;
    const dy = Math.sin(angulo) * distancia;

    p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.1)`;
    p.style.opacity = '0';

    setTimeout(() => p.remove(), 1200);
  }
}

/* =========================================================
   INTERACCIÓN DE PISTAS
   ========================================================= */
function revelarTarjeta(card) {
  if (card.classList.contains('revelada')) return;

  card.classList.add('revelada');

  const id = card.getAttribute('data-pista');
  if (id) descubiertas.add(id);

  // Vibración corta en móviles compatibles
  if (navigator.vibrate) {
    try { navigator.vibrate(18); } catch (e) {}
  }

  // Actualizar barra de progreso
  if (progresoBarra) {
    const pct = (descubiertas.size / TOTAL_PISTAS) * 100;
    progresoBarra.style.width = pct + '%';
  }

  // Si se descubrieron todas, mostrar pista final con efecto
  if (descubiertas.size >= TOTAL_PISTAS && pistaFinal) {
    setTimeout(() => {
      pistaFinal.classList.add('visible');
      // Pequeño estallido central desde la pista final
      const rect = pistaFinal.getBoundingClientRect();
      estallidoParticulas(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }, 450);
  }
}

tarjetasPista.forEach(card => {
  card.addEventListener('click', () => revelarTarjeta(card));

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      revelarTarjeta(card);
    }
  });

  // Efecto "tilt" sutil en escritorio para que se sienta viva
  card.addEventListener('mousemove', (e) => {
    if (card.classList.contains('revelada')) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;

    card.style.transform = `perspective(900px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* Pista final: al tocar, lanza un estallido */
if (pistaFinal) {
  pistaFinal.addEventListener('click', (e) => {
    const rect = pistaFinal.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    estallidoParticulas(x, y);
  });
}

/* =========================================================
   REINICIAR PISTAS
   ========================================================= */
function reiniciarPistas() {
  descubiertas.clear();
  tarjetasPista.forEach(card => {
    card.classList.remove('revelada');
    card.style.transform = '';
  });
  if (pistaFinal) pistaFinal.classList.remove('visible');
  if (progresoBarra) progresoBarra.style.width = '0%';
}

/* =========================================================
   INICIALIZACIÓN
   ========================================================= */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', crearParticulas);
} else {
  crearParticulas();
}

console.log('Invitación especial cargada.');