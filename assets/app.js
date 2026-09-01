/* Design Academy — capa de interactividad compartida.
   Vanilla JS. Se carga con `defer` en las 13 páginas.
   La barra lateral (<aside nav a[data-path]>) es la fuente de verdad del temario.
   Todo el estado vive en localStorage con prefijo "da:". */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Almacenamiento
   * ------------------------------------------------------------------ */
  var KEY_DONE = 'da:completed';

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function getDone() {
    var v = read(KEY_DONE, []);
    return Array.isArray(v) ? v : [];
  }
  function setDone(list) {
    var seen = {}, out = [];
    list.forEach(function (p) { if (p && !seen[p]) { seen[p] = 1; out.push(p); } });
    write(KEY_DONE, out);
  }
  function isDone(path) { return getDone().indexOf(path) !== -1; }
  function markDone(path, done) {
    var list = getDone();
    var idx = list.indexOf(path);
    if (done && idx === -1) list.push(path);
    if (!done && idx !== -1) list.splice(idx, 1);
    setDone(list);
    refreshAll();
  }
  function toggleDone(path) { markDone(path, !isDone(path)); }

  /* ------------------------------------------------------------------ *
   * Temario derivado de la barra lateral
   * ------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('aside nav a[data-path]')
  );

  function labelOf(a) {
    var box = a.querySelector('div');
    var node = box ? box.cloneNode(true) : a.cloneNode(true);
    Array.prototype.forEach.call(
      node.querySelectorAll('.material-symbols-outlined'),
      function (s) { s.remove(); }
    );
    return node.textContent.replace(/\s+/g, ' ').trim();
  }

  var MODULES = navLinks
    .filter(function (a) { return a.dataset.path !== 'curriculum-overview'; })
    .map(function (a) {
      return { path: a.dataset.path, label: labelOf(a), href: a.getAttribute('href'), el: a };
    });

  var active = document.querySelector('aside nav a[aria-current="page"]');
  var CURRENT = active ? active.dataset.path : null;
  var IS_DASHBOARD = CURRENT === 'curriculum-overview' ||
    /(^|\/)index\.html?$/.test(location.pathname) || location.pathname.replace(/.*\//, '') === '';

  var META = {
    'ui-vs-ux':           { n: 1,  title: 'Conceptos fundamentales: UI y UX', desc: 'Comprende la diferencia esencial entre la Interfaz de Usuario y la Experiencia de Usuario, y cómo colaboran.', min: 45 },
    'design-principles':   { n: 2,  title: 'Principios de Diseño', desc: 'Jerarquía visual, contraste, alineación, proximidad y espacio en blanco.', min: 45 },
    'visual-hierarchy':    { n: 3,  title: 'Jerarquía Visual', desc: 'Escala, contraste y patrones de lectura para coreografiar la mirada del usuario.', min: 45 },
    'color-psychology':    { n: 4,  title: 'Psicología del Color', desc: 'Cómo los colores evocan emociones, guían la atención y construyen confianza.', min: 40 },
    'typography-systems':  { n: 5,  title: 'Sistemas Tipográficos', desc: 'Familias, escala y jerarquía del texto; legibilidad.', min: 45 },
    'wireframing':         { n: 6,  title: 'Wireframing', desc: 'El plano estructural de una pantalla antes de decorarla.', min: 40 },
    'accessibility':       { n: 7,  title: 'Accesibilidad', desc: 'Principios WCAG (POUR), contraste de color y soporte de lectores de pantalla.', min: 45 }
  };

  function firstPending() {
    for (var i = 0; i < MODULES.length; i++) {
      if (!isDone(MODULES[i].path)) return MODULES[i];
    }
    return MODULES[MODULES.length - 1];
  }
  function completedCount() {
    return MODULES.filter(function (m) { return isDone(m.path); }).length;
  }

  /* ------------------------------------------------------------------ *
   * Utilidades de UI
   * ------------------------------------------------------------------ */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'da-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    // reflow para reiniciar la transición
    void toastEl.offsetWidth;
    toastEl.classList.add('da-toast--show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('da-toast--show');
    }, 2800);
  }

  function icon(name) {
    return '<span class="material-symbols-outlined">' + name + '</span>';
  }

  var refreshers = [];
  function onRefresh(fn) { refreshers.push(fn); try { fn(); } catch (e) {} }
  function refreshAll() {
    refreshers.forEach(function (fn) { try { fn(); } catch (e) { /* noop */ } });
  }

  /* ------------------------------------------------------------------ *
   * 1. Puntos de estado de la barra lateral
   * ------------------------------------------------------------------ */
  onRefresh(function paintSidebar() {
    MODULES.forEach(function (m) {
      var dot = m.el.querySelector('.rounded-full');
      if (!dot) return;
      dot.classList.remove('bg-outline', 'bg-tertiary-fixed-dim', 'bg-tertiary-fixed');
      dot.classList.add(isDone(m.path) ? 'bg-tertiary-fixed-dim' : 'bg-outline');
    });
  });

  /* ------------------------------------------------------------------ *
   * 1b. Menú lateral plegable
   * ------------------------------------------------------------------ */
  (function navToggle() {
    var header = document.querySelector('header');
    if (!header) return;
    var KEY = 'da:navCollapsed';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'da-nav-toggle';
    btn.setAttribute('aria-label', 'Mostrar u ocultar el menú');
    btn.setAttribute('aria-controls', 'da-sidebar');

    var aside = document.querySelector('aside');
    if (aside && !aside.id) aside.id = 'da-sidebar';

    function sync() {
      var collapsed = document.body.classList.contains('da-nav-collapsed');
      btn.innerHTML = icon(collapsed ? 'menu' : 'menu_open');
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.title = collapsed ? 'Mostrar el menú' : 'Ocultar el menú';
    }

    if (read(KEY, false) === true) document.body.classList.add('da-nav-collapsed');
    btn.addEventListener('click', function () {
      var collapsed = document.body.classList.toggle('da-nav-collapsed');
      write(KEY, collapsed);
      sync();
    });
    header.insertBefore(btn, header.firstChild);
    sync();
  })();

  /* ------------------------------------------------------------------ *
   * 2. Botón flotante "Marcar módulo como completado" (lecciones/proyecto)
   * ------------------------------------------------------------------ */
  if (CURRENT && CURRENT !== 'curriculum-overview') {
    var completeBtn = document.createElement('button');
    completeBtn.className = 'da-complete';
    completeBtn.type = 'button';
    completeBtn.addEventListener('click', function () {
      toggleDone(CURRENT);
      toast(isDone(CURRENT)
        ? 'Módulo marcado como completado'
        : 'Módulo marcado como pendiente');
    });
    document.body.appendChild(completeBtn);
    // El botón es "position: fixed" en la esquina inferior derecha, así que
    // puede tapar el enlace "Siguiente" del pie de la lección al hacer scroll
    // hasta el final. Se añade holgura extra para que nunca se solapen.
    document.body.classList.add('da-has-floating-complete');
    onRefresh(function syncCompleteBtn() {
      var done = isDone(CURRENT);
      completeBtn.classList.toggle('da-complete--done', done);
      completeBtn.innerHTML = done
        ? icon('task_alt') + 'Módulo completado'
        : icon('radio_button_unchecked') + 'Marcar módulo como completado';
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. Buscador del header
   * ------------------------------------------------------------------ */
  (function search() {
    var input = document.querySelector('header input[type="text"]');
    if (!input) return;
    var box = input.closest('div');
    if (box && getComputedStyle(box).position === 'static') box.style.position = 'relative';

    var results = document.createElement('div');
    results.className = 'da-search-results';
    results.hidden = true;
    (box || input.parentNode).appendChild(results);

    var COMBINING = new RegExp('[\\u0300-\\u036f]', 'g');
    var norm = function (s) {
      return s.toLowerCase().normalize('NFD').replace(COMBINING, '');
    };

    function render() {
      var q = norm(input.value.trim());
      if (!q) { results.hidden = true; return; }
      var hits = MODULES.filter(function (m) { return norm(m.label).indexOf(q) !== -1; });
      if (!hits.length) {
        results.innerHTML = '<div class="da-empty">Sin resultados para “' + input.value.trim() + '”</div>';
      } else {
        results.innerHTML = hits.map(function (m) {
          return '<a href="' + m.href + '">' + icon('menu_book') +
            '<span>' + m.label + '</span>' +
            (isDone(m.path) ? '<span class="material-symbols-outlined da-done">check_circle</span>' : '') +
            '</a>';
        }).join('');
      }
      results.hidden = false;
    }

    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = results.querySelector('a');
        if (first) { e.preventDefault(); location.href = first.getAttribute('href'); }
      } else if (e.key === 'Escape') {
        results.hidden = true;
        input.blur();
      }
    });
    document.addEventListener('click', function (e) {
      if (!results.contains(e.target) && e.target !== input) results.hidden = true;
    });
  })();

  /* ------------------------------------------------------------------ *
   * 5. Banner: barra de progreso del módulo (refleja el estado real)
   * ------------------------------------------------------------------ */
  (function heroProgress() {
    var bar = document.getElementById('hero-progress');
    var pct = document.getElementById('hero-progress-pct');
    if (!bar && !pct) return;
    onRefresh(function syncHero() {
      var v = CURRENT && isDone(CURRENT) ? 100 : 0;
      if (bar) { bar.style.transition = 'width .8s ease'; bar.style.width = v + '%'; }
      if (pct) pct.textContent = v + '%';
    });
  })();

  /* ------------------------------------------------------------------ *
   * 6. Pares de flechas (chevron) sin destino de scroll -> se ocultan
   * ------------------------------------------------------------------ */
  (function looseChevrons() {
    function text(el) { return el.textContent.replace(/\s+/g, ' ').trim(); }
    Array.prototype.slice.call(document.querySelectorAll('button'))
      .filter(function (el) {
        var t = text(el);
        return t === 'chevron_left' || t === 'chevron_right' || t === 'chevron_right chevron_left';
      })
      .forEach(function (el) {
        var wrap = el.parentElement;
        var scroller = wrap && (wrap.previousElementSibling || wrap.nextElementSibling ||
          (wrap.parentElement && wrap.parentElement.querySelector('.overflow-x-auto, [class*="snap-x"]')));
        if (scroller && scroller.scrollWidth > scroller.clientWidth + 8) {
          el.addEventListener('click', function () {
            var dir = text(el) === 'chevron_left' ? -1 : 1;
            scroller.scrollBy({ left: dir * Math.round(scroller.clientWidth * 0.8), behavior: 'smooth' });
          });
        } else if (wrap) {
          wrap.style.display = 'none';
        }
      });
  })();

  /* ------------------------------------------------------------------ *
   * 7. Exploradores de concepto: acordeones y pestañas (delegado)
   * ------------------------------------------------------------------ */
  (function conceptExplorers() {
    // Los acordeones arrancan abiertos: toda la información queda visible de entrada.
    Array.prototype.forEach.call(document.querySelectorAll('.da-acc__head'), function (head) {
      head.setAttribute('aria-expanded', 'true');
      var body = head.nextElementSibling;
      if (body && body.classList.contains('da-acc__body')) body.hidden = false;
    });

    document.addEventListener('click', function (e) {
      // --- acordeón ---
      var head = e.target.closest ? e.target.closest('.da-acc__head') : null;
      if (head) {
        var open = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', open ? 'false' : 'true');
        var body = head.nextElementSibling;
        if (body && body.classList.contains('da-acc__body')) body.hidden = open;
        return;
      }
      // --- pestañas ---
      var tab = e.target.closest ? e.target.closest('.da-tab') : null;
      if (tab && tab.parentElement && tab.parentElement.classList.contains('da-tabs')) {
        var group = tab.parentElement;
        var view = tab.getAttribute('data-view');
        Array.prototype.forEach.call(group.querySelectorAll('.da-tab'), function (t) {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        // paneles: buscar en el contenedor común más cercano
        var scope = group.closest('section, .rounded-xl, div') || document;
        var panels = scope.querySelectorAll('.da-panel[data-view]');
        if (!panels.length && scope.parentElement) panels = scope.parentElement.querySelectorAll('.da-panel[data-view]');
        Array.prototype.forEach.call(panels, function (p) {
          p.hidden = p.getAttribute('data-view') !== view;
        });
      }
    });
  })();

  /* ------------------------------------------------------------------ *
   * 7b. Diploma de finalización (al completar todos los módulos)
   * ------------------------------------------------------------------ */
  (function diploma() {
    var KEY_NAME = 'da:studentName';
    var total = MODULES.length;

    function allDone() { return total > 0 && completedCount() >= total; }

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function overlay(html) {
      var el = document.createElement('div');
      el.className = 'da-diploma-overlay';
      el.innerHTML = html;
      el.addEventListener('click', function (e) { if (e.target === el) el.remove(); });
      document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') { el.remove(); document.removeEventListener('keydown', onEsc); }
      });
      document.body.appendChild(el);
      return el;
    }

    function promptName() {
      var el = overlay(
        '<div class="da-diploma" style="max-width:440px">' +
          '<div class="da-diploma__sheet" style="padding:34px 30px">' +
            '<div class="da-diploma__brand"><span class="da-brand__mark">E</span>' +
            '<span class="da-brand__text"><b>Eli</b>Diseng</span></div>' +
            '<div class="da-diploma__kicker">Curso completado</div>' +
            '<h2 class="da-diploma__title" style="font-size:21px;margin:10px 0 8px">¡Enhorabuena!</h2>' +
            '<p class="da-diploma__body" style="margin:0 0 18px">Has terminado las ' + total +
            ' lecciones. Escribe tu nombre tal y como quieres que aparezca en el diploma.</p>' +
            '<input class="da-diploma__input" type="text" maxlength="60" ' +
            'placeholder="Nombre y apellidos" aria-label="Tu nombre"/>' +
            '<div class="da-diploma__actions" style="padding:16px 0 0">' +
              '<button type="button" data-act="cancel">Ahora no</button>' +
              '<button type="button" data-act="ok" class="da-primary-btn">Generar diploma</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
      var input = el.querySelector('input');
      setTimeout(function () { input.focus(); }, 30);
      function submit() {
        var v = input.value.trim().replace(/\s+/g, ' ');
        if (!v) { input.focus(); return; }
        write(KEY_NAME, v);
        el.remove();
        showDiploma(v);
      }
      el.querySelector('[data-act="ok"]').addEventListener('click', submit);
      el.querySelector('[data-act="cancel"]').addEventListener('click', function () { el.remove(); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    }

    function showDiploma(name) {
      var fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      var el = overlay(
        '<div class="da-diploma">' +
          '<div class="da-diploma__sheet">' +
            '<span class="da-diploma__corner da-diploma__corner--tl"></span>' +
            '<span class="da-diploma__corner da-diploma__corner--tr"></span>' +
            '<span class="da-diploma__corner da-diploma__corner--bl"></span>' +
            '<span class="da-diploma__corner da-diploma__corner--br"></span>' +
            '<div class="da-diploma__brand"><span class="da-brand__mark">E</span>' +
            '<span class="da-brand__text"><b>Eli</b>Diseng</span></div>' +
            '<div class="da-diploma__kicker">Diploma de finalización</div>' +
            '<h1 class="da-diploma__title">Introducción al diseño de interfaces</h1>' +
            '<p class="da-diploma__awarded">Se otorga a</p>' +
            '<div class="da-diploma__name">' + esc(name) + '</div>' +
            '<p class="da-diploma__body">Por completar con éxito las ' + total +
            ' lecciones del curso: fundamentos de UI y UX, principios de diseño, jerarquía visual, ' +
            'psicología del color, tipografía, wireframing y accesibilidad.</p>' +
            '<svg class="da-diploma__seal" viewBox="0 0 100 100" aria-hidden="true">' +
              '<circle cx="50" cy="50" r="34" fill="none" stroke="#182442" stroke-width="2"/>' +
              '<circle cx="50" cy="50" r="27" fill="none" stroke="#3cddc7" stroke-width="1.5" stroke-dasharray="3 3"/>' +
              '<path d="M38 51 l8 8 l17 -19" fill="none" stroke="#182442" stroke-width="4" ' +
              'stroke-linecap="round" stroke-linejoin="round"/>' +
              '<path d="M50 84 l-9 12 M50 84 l9 12" stroke="#3cddc7" stroke-width="3" stroke-linecap="round"/>' +
            '</svg>' +
            '<div class="da-diploma__meta"><span>Fecha: ' + fecha + '</span>' +
            '<span>EliDiseng · Frontend · Concepto</span></div>' +
          '</div>' +
          '<div class="da-diploma__actions">' +
            '<button type="button" data-act="print" class="da-primary-btn">Imprimir / Guardar PDF</button>' +
            '<button type="button" data-act="rename">Cambiar nombre</button>' +
            '<button type="button" data-act="close">Cerrar</button>' +
          '</div>' +
        '</div>'
      );
      el.querySelector('[data-act="print"]').addEventListener('click', function () { window.print(); });
      el.querySelector('[data-act="close"]').addEventListener('click', function () { el.remove(); });
      el.querySelector('[data-act="rename"]').addEventListener('click', function () {
        el.remove();
        try { localStorage.removeItem(KEY_NAME); } catch (e) {}
        promptName();
      });
    }

    function open() {
      var n = read(KEY_NAME, '');
      if (n) showDiploma(n); else promptName();
    }

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'da-diploma-fab';
    fab.hidden = true;
    fab.innerHTML = icon('workspace_premium') + 'Ver diploma';
    fab.addEventListener('click', open);
    document.body.appendChild(fab);

    var wasAllDone = allDone();
    onRefresh(function syncDiploma() {
      var now = allDone();
      fab.hidden = !now;
      if (now && !wasAllDone) { wasAllDone = true; open(); }
      if (!now) wasAllDone = false;
    });
  })();

  /* ------------------------------------------------------------------ *
   * 8. Dashboard (index.html)
   * ------------------------------------------------------------------ */
  if (IS_DASHBOARD) {
    (function dashboard() {
      var total = MODULES.length;

      // --- panel "Progreso del Curso" ---
      var progressH2 = Array.prototype.slice.call(document.querySelectorAll('h2'))
        .find(function (h) { return /Progreso del Curso/i.test(h.textContent); });
      var panel = progressH2 ? progressH2.closest('.rounded-xl') : null;

      if (panel && !panel.querySelector('.da-reset')) {
        var reset = document.createElement('button');
        reset.type = 'button';
        reset.className = 'da-reset';
        reset.textContent = 'Reiniciar progreso';
        reset.addEventListener('click', function () {
          if (confirm('¿Reiniciar todo tu progreso del curso?')) {
            try {
              localStorage.removeItem(KEY_DONE);
              localStorage.removeItem('da:studentName');
            } catch (e) {}
            refreshAll();
            toast('Progreso reiniciado');
          }
        });
        panel.appendChild(reset);
      }

      onRefresh(function updateProgressPanel() {
        if (!panel) return;
        var n = completedCount();
        var pct = Math.round((n / total) * 100);

        var bigNum = panel.querySelector('#da-progress-count') || panel.querySelector('.font-headline-xl');
        if (bigNum) {
          bigNum.textContent = String(n);
          if (bigNum.nextElementSibling) bigNum.nextElementSibling.textContent = '/ ' + total;
        }
        var fill = panel.querySelector('.bg-tertiary-fixed');
        if (fill) {
          fill.className = fill.className.replace(/w-\[[^\]]*\]/g, '').trim();
          fill.style.width = Math.max(pct, 2) + '%';
        }
        Array.prototype.forEach.call(panel.querySelectorAll('.font-label-sm'), function (s) {
          if (/^\s*\d+\s*%\s*completado/i.test(s.textContent)) s.textContent = pct + '% Completado';
          if (/^\s*\d+\s*%\s*restante/i.test(s.textContent)) s.textContent = (100 - pct) + '% Restante';
        });
      });

      // --- "Continuar Aprendiendo" + tarjeta "Tu Próxima Lección" ---
      var continueLink = Array.prototype.slice.call(document.querySelectorAll('a'))
        .find(function (a) { return /Continuar Aprendiendo/i.test(a.textContent); });
      var nextH3 = Array.prototype.slice.call(document.querySelectorAll('h3'))
        .find(function (h) { return /Tu Próxima Lección/i.test(h.textContent); });
      var nextCard = nextH3 ? nextH3.parentElement.querySelector('.rounded-xl, .shadow-md') : null;

      onRefresh(function updateNext() {
        var next = firstPending();
        var meta = META[next.path] || {};
        if (continueLink) {
          continueLink.setAttribute('href', next.href);
          var firstNode = continueLink.childNodes[0];
          if (completedCount() > 0 && firstNode && firstNode.nodeType === 3) {
            firstNode.nodeValue = ' Reanudar aprendizaje ';
          }
        }
        if (nextCard) {
          var h4 = nextCard.querySelector('h4');
          var p = nextCard.querySelector('p');
          var badge = Array.prototype.slice.call(nextCard.querySelectorAll('span'))
            .find(function (s) { return /Módulo\s*\d+/i.test(s.textContent); });
          if (h4) h4.textContent = meta.title || next.label;
          if (p) p.textContent = meta.desc || '';
          if (badge && meta.n) badge.textContent = 'Módulo ' + meta.n;
          if (!nextCard._daNav) {
            nextCard._daNav = true;
            nextCard.style.cursor = 'pointer';
            nextCard.addEventListener('click', function () { location.href = next.href; });
          }
        }
      });

      // --- mapa del curso: se regenera por completo desde MODULES ---
      var mapAnchor = Array.prototype.slice.call(document.querySelectorAll('span'))
        .find(function (s) { return /^Mód\s*0?\d+$/i.test(s.textContent.trim()); });
      var mapGrid = mapAnchor ? mapAnchor.closest('.grid') : null;

      if (mapGrid) {
        onRefresh(function renderMap() {
          var pendingIdx = MODULES.indexOf(firstPending());
          mapGrid.innerHTML = MODULES.map(function (m, i) {
            var mDone = isDone(m.path);
            var mCurrent = i === pendingIdx && !mDone;
            var state = mDone ? 'done' : (mCurrent ? 'current' : 'pending');
            var meta = META[m.path] || {};
            var ic = mDone ? 'task_alt' : (mCurrent ? 'play_circle' : 'lock_open');
            var label = mDone ? 'Completado' : (mCurrent ? 'Siguiente' : 'Pendiente');
            return '<a class="da-map-card da-map-card--' + state + '" href="' + m.href + '">' +
              '<span class="da-map-card__top">' +
                '<span class="material-symbols-outlined da-map-card__icon">' + ic + '</span>' +
                '<span class="da-map-card__badge">' + label + '</span>' +
              '</span>' +
              '<span class="da-map-card__meta">' +
                '<span class="da-map-card__n">Módulo ' + (meta.n || (i + 1)) + '</span>' +
                '<span class="da-map-card__title">' + m.label.replace(/[<>&]/g, '') + '</span>' +
              '</span>' +
            '</a>';
          }).join('');
        });
      }

      var verLista = Array.prototype.slice.call(document.querySelectorAll('button'))
        .find(function (b) { return /ver lista/i.test(b.textContent); });
      if (verLista) {
        verLista.addEventListener('click', function () {
          openModulesModal();
        });
      }
    })();
  }

  /* modal con el temario completo (reutilizable) */
  function openModulesModal() {
    var pendingIdx = MODULES.indexOf(firstPending());
    var backdrop = document.createElement('div');
    backdrop.className = 'da-modal-backdrop';
    backdrop.innerHTML =
      '<div class="da-modal" role="dialog" aria-modal="true">' +
      '<header><h3>Temario del curso</h3><button type="button" aria-label="Cerrar">' + icon('close') + '</button></header>' +
      '<ol>' + MODULES.map(function (m, idx) {
        var unlocked = isDone(m.path) || idx <= pendingIdx;
        return '<li><a class="' + (unlocked ? '' : 'da-locked') + '" href="' + m.href + '">' +
          '<span>' + m.label + '</span>' +
          icon(isDone(m.path) ? 'check_circle' : (unlocked ? 'chevron_right' : 'lock')) +
          '</a></li>';
      }).join('') + '</ol></div>';
    function close() { backdrop.remove(); }
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
    backdrop.querySelector('header button').addEventListener('click', close);
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
    document.body.appendChild(backdrop);
  }
})();
