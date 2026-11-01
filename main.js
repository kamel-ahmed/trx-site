const nav = document.getElementById('nav');
const ind = document.getElementById('ind');
const desk = document.getElementById('desk');
const deskLinks = [...desk.querySelectorAll('a')];
const mobile = document.getElementById('mobile');
const mobLinks = [...mobile.querySelectorAll('a')];
const burger = document.getElementById('burger');
const userBtn = document.getElementById('userBtn');
const userMenu = document.getElementById('userMenu');
let active = deskLinks[0];

function move(el) {
    if (!el || !el.offsetWidth) return;
    ind.style.width = el.offsetWidth + 'px';
    ind.style.transform = 'translate(' + el.offsetLeft + 'px, -50%)';
    ind.style.opacity = 1;
}
function setActive(i) {
    [...deskLinks, ...mobLinks].forEach(l => l.removeAttribute('aria-current'));
    deskLinks[i].setAttribute('aria-current', 'page');
    mobLinks[i].setAttribute('aria-current', 'page');
    active = deskLinks[i];
    move(active);
}
deskLinks.forEach((l, i) => {
    l.addEventListener('mouseenter', () => move(l));
    l.addEventListener('focus', () => move(l));
    l.addEventListener('click', () => setActive(i));
});
desk.addEventListener('mouseleave', () => move(active));
desk.addEventListener('focusout', () => move(active));

function toggleMobile(open) {
    mobile.dataset.open = open;
    burger.setAttribute('aria-expanded', open);
}
burger.addEventListener('click', () => toggleMobile(mobile.dataset.open !== 'true'));
mobLinks.forEach((l, i) => l.addEventListener('click', () => { setActive(i); toggleMobile(false); }));

function toggleUser(open) {
    userMenu.dataset.open = open;
    userBtn.setAttribute('aria-expanded', open);
}
userBtn.addEventListener('click', e => { e.stopPropagation(); toggleUser(userMenu.dataset.open !== 'true'); });
document.addEventListener('click', e => {
    if (!userMenu.contains(e.target)) toggleUser(false);
    if (!mobile.contains(e.target) && !burger.contains(e.target)) toggleMobile(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { toggleUser(false); toggleMobile(false); } });

const onScroll = () => { nav.dataset.scrolled = window.scrollY > 10; };
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => move(active));
window.addEventListener('load', () => { move(active); onScroll(); });
if (document.fonts) document.fonts.ready.then(() => move(active));

// Contact section: scroll reveal + demo submit animation
(() => {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in'));
    } else {
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        }), { threshold: 0.15 });
        items.forEach(el => io.observe(el));
    }
    const form = document.getElementById('contactForm');
    const done = document.getElementById('contactDone');
    const btn = document.getElementById('sendBtn');
    const lbl = btn.querySelector('.lbl');
    form.addEventListener('submit', e => {
        e.preventDefault();
        btn.disabled = true;
        lbl.textContent = 'Sending…';
        form.classList.add('sending');
        setTimeout(() => { done.dataset.open = 'true'; }, 900);
    });
    document.getElementById('contactAgain').addEventListener('click', () => {
        done.dataset.open = 'false';
        form.reset();
        form.classList.remove('sending');
        btn.disabled = false;
        lbl.textContent = 'Send message';
    });
})();
(() => {
    const steps = [...document.querySelectorAll('.step')];
    if (!steps.length) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0, t;
    const set = n => { i = n; steps.forEach((s, k) => s.dataset.active = k === n); };
    const loop = () => { clearInterval(t); if (!reduce) t = setInterval(() => set((i + 1) % steps.length), 2000); };
    steps.forEach((s, k) => s.addEventListener('click', () => { set(k); loop(); }));
    loop();
})();

(() => {
    const thumb = document.getElementById('billThumb');
    const btns = [...document.querySelectorAll('#bill button')];
    const prices = [...document.querySelectorAll('.price')];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!thumb || !btns.length) return;

    const countTo = (el, to) => {
        const from = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
        if (reduce) { el.textContent = to.toLocaleString('en-US'); return; }
        const t0 = performance.now(), dur = 600;
        const tick = now => {
            const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(from + (to - from) * e).toLocaleString('en-US');
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    btns.forEach(b => b.addEventListener('click', () => {
        const yearly = b.dataset.bill === 'y';
        thumb.style.transform = yearly ? 'translateX(100%)' : 'translateX(0)';
        btns.forEach(x => x.setAttribute('aria-pressed', x === b));
        prices.forEach(p => countTo(p, +p.dataset[yearly ? 'y' : 'm']));
    }));

    // cursor spotlight
    document.querySelectorAll('.plan').forEach(c => c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
})();

(() => {
    const el = document.getElementById('rm');
    if (!el) return;
    el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
})();

document.getElementById('year').textContent = new Date().getFullYear();

