const menu = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');
const progress = document.querySelector('.reading-progress');

menu?.addEventListener('click', () => {
  const open = links?.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(Boolean(open)));
});

links?.addEventListener('click', () => {
  links.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
});

const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const scenarios = {
  core: {
    revenues: ['€177k', '€418k', '€501k'], heights: ['35%', '83%', '100%'],
    ebitda: ['−€32k', '−€68k', '−€41k'], need: '€346k', label: 'Core Test',
    note: 'Solo core fisico + AI. Nessun nuovo workbook né B2B: mostra il costo di non attivare le estensioni.'
  },
  test: {
    revenues: ['€187k', '€477k', '€579k'], heights: ['32%', '82%', '100%'],
    ebitda: ['−€28k', '−€36k', '+€1k'], need: '€287k', label: 'Operating Test',
    note: 'Caso base: un nuovo workbook, primi ricavi B2B e acquisizione AI controllata. È la previsione operativa, non una promessa.'
  },
  scale: {
    revenues: ['€200k', '€591k', '€791k'], heights: ['25%', '75%', '100%'],
    ebitda: ['−€29k', '−€15k', '+€64k'], need: '€267k', label: 'Operating Scale',
    note: 'Si attiva solo dopo evidenza di CAC ≤€20, churn ≤6% e LTV/CAC ≥3x. La scala è un diritto da conquistare.'
  }
};

document.querySelectorAll('[data-scenario]').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.scenario;
    const data = scenarios[key];
    if (!data) return;
    document.querySelectorAll('[data-scenario]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('[data-scenario-label]').textContent = data.label;
    document.querySelector('[data-scenario-note]').textContent = data.note;
    document.querySelector('[data-scenario-need]').textContent = data.need;
    document.querySelectorAll('[data-revenue]').forEach((item, index) => {
      item.textContent = data.revenues[index];
      item.closest('.year').querySelector('i').style.setProperty('--height', data.heights[index]);
    });
    document.querySelectorAll('[data-ebitda]').forEach((item, index) => item.textContent = data.ebitda[index]);
  });
});
