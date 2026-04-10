/* ============================================
   MedJava — Simulation Renderer v9
   NEW APPROACH: Ignore <medjava-sim> tags.
   Instead, find every <pre><code> in the message
   and append a working interactive stepper
   directly after it.
   ============================================ */
const SimRenderer = (() => {
  function escH(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  // Strip medjava-sim tags from HTML (they're useless now)
  function extractSims(rawHtml) {
    const cleaned = rawHtml.replace(/<medjava-sim[\s\S]*?<\/medjava-sim>/gi, '');
    return { html: cleaned, sims: [] };
  }

  // Called after every message render — finds code blocks and adds simulations
  function processMessage(element) {
    // Remove any medjava-sim remnants
    element.querySelectorAll('.sim-placeholder').forEach(p => p.remove());

    // Find all <pre> blocks with code
    const preBlocks = element.querySelectorAll('pre');
    preBlocks.forEach(pre => {
      // Skip if already has a simulation after it
      if (pre.nextElementSibling && pre.nextElementSibling.classList.contains('medjava-sim-card')) return;
      // Skip if inside a simulation card already
      if (pre.closest('.medjava-sim-card')) return;

      const codeEl = pre.querySelector('code');
      if (!codeEl) return;

      const code = codeEl.textContent;
      // Only add sim for Java-looking code (not shell commands, not short snippets)
      if (code.length < 40) return;
      if (!code.includes(';')) return;
      const hasJava = /\b(int |double |String |boolean |System\.|public |class |if\s*\(|while\s*\(|for\s*\()/.test(code);
      if (!hasJava) return;

      // Parse into steps
      const codeLines = code.split('\n').filter(l => l.trim());
      const steps = parseCode(codeLines);
      if (steps.length < 2) return;

      // Build and insert simulation card after the <pre>
      const card = buildCard(codeLines, steps);
      pre.insertAdjacentElement('afterend', card);
    });
  }

  function parseCode(codeLines) {
    let steps = [], mem = {}, out = '';

    codeLines.forEach((raw, i) => {
      const t = raw.trim();
      if (!t) return;
      let narr = '', expl = '';

      if (t === '{') {
        narr = 'Opening code block.';
        expl = 'Everything between { and } runs as a group — like a set of medical orders that belong together.';
      }
      else if (t === '}') {
        narr = 'Closing code block.';
      }
      else if (t.startsWith('//')) {
        narr = 'Comment: ' + t.replace(/^\/\/\s*/, '');
        expl = 'Notes for humans — the computer skips this line completely.';
      }
      else if (t.startsWith('import')) {
        narr = 'Loading a library.';
        expl = 'Getting tools from Java\'s supply room — like a nurse fetching instruments before a procedure.';
      }
      else if (t.match(/^public\s+class/)) {
        narr = 'Program declaration.';
        expl = 'Every Java program lives inside a class — think of it as the front cover of a patient file.';
      }
      else if (t.match(/public\s+static\s+void\s+main/)) {
        narr = 'Execution starts here.';
        expl = 'The computer begins reading from this line and goes downward — like starting a ward round from bed 1.';
      }
      else {
        // Variable declaration: int x = 5; or double temp = 37.5; or String name = "Ama";
        const decl = t.match(/(?:int|double|String|boolean|float|long|char)\s+(\w+)\s*=\s*(.+?)\s*;/);
        if (decl) {
          let val = decl[2].replace(/"/g, '').trim();
          mem = { ...mem, [decl[1]]: val };
          narr = `Create "${decl[1]}" = ${val}`;
          expl = `The computer makes a labeled storage box called "${decl[1]}" and writes ${val} inside it.`;
        }
        // Reassignment: x = x - 5; or name = "new";
        else if (t.match(/^\s*(\w+)\s*=\s*(.+?)\s*;/) && !t.includes('System.') && !t.includes('new ')) {
          const rm = t.match(/^\s*(\w+)\s*=\s*(.+?)\s*;/);
          let nv = rm[2].replace(/"/g, '').trim();
          // Try to evaluate math
          try {
            let expr = nv;
            for (const [k, v] of Object.entries(mem)) {
              expr = expr.replace(new RegExp('\\b' + k + '\\b', 'g'), v);
            }
            const result = Function('"use strict"; return (' + expr + ')')();
            nv = String(result);
          } catch (x) { /* keep original */ }
          mem = { ...mem, [rm[1]]: nv };
          narr = `Update "${rm[1]}" → ${nv}`;
          expl = `The old value is erased and ${nv} is written instead — like updating a vital sign.`;
        }
        // println
        else if (t.includes('System.out.println')) {
          const pm = t.match(/println\s*\((.+?)\)\s*;/);
          if (pm) {
            let r = pm[1].replace(/"/g, '');
            for (const [k, v] of Object.entries(mem)) {
              r = r.replace(new RegExp('\\b' + k + '\\b', 'g'), v);
            }
            r = r.replace(/\s*\+\s*/g, '');
            out += (out ? '\n' : '') + r;
            narr = `Print: "${r}"`;
            expl = `This line sends text to the screen — the user now sees: ${r}`;
          } else {
            narr = 'Printing to screen.';
          }
        }
        // print (no newline)
        else if (t.includes('System.out.print(')) {
          const pm = t.match(/print\s*\((.+?)\)/);
          if (pm) {
            let r = pm[1].replace(/"/g, '');
            for (const [k, v] of Object.entries(mem)) {
              r = r.replace(new RegExp('\\b' + k + '\\b', 'g'), v);
            }
            r = r.replace(/\s*\+\s*/g, '');
            out += r;
            narr = `Print: "${r}" (same line)`;
          }
        }
        // else if
        else if (t.match(/}\s*else\s+if\s*\(/)) {
          const cm = t.match(/else\s+if\s*\((.+?)\)/);
          let res = '?';
          if (cm) {
            try {
              let e = cm[1];
              for (const [k, v] of Object.entries(mem)) e = e.replace(new RegExp('\\b' + k + '\\b', 'g'), v);
              res = Function('"use strict"; return (' + e + ')')() ? 'YES ✓' : 'NO ✗';
            } catch (x) {}
          }
          narr = cm ? `Else-if: ${cm[1]} → ${res}` : 'Checking next condition.';
        }
        // if
        else if (t.match(/^\s*if\s*\(/)) {
          const cm = t.match(/if\s*\((.+?)\)/);
          let res = '?';
          if (cm) {
            try {
              let e = cm[1];
              for (const [k, v] of Object.entries(mem)) e = e.replace(new RegExp('\\b' + k + '\\b', 'g'), v);
              res = Function('"use strict"; return (' + e + ')')() ? 'YES ✓' : 'NO ✗';
            } catch (x) {}
          }
          narr = cm ? `Check: ${cm[1]} → ${res}` : 'Checking condition.';
          expl = 'Like a triage nurse checking if a reading is in the danger zone.';
        }
        // else
        else if (t.match(/}\s*else/)) {
          narr = 'Else — taking the other path.';
          expl = 'The condition was false, so we skip to the alternative instructions.';
        }
        // while
        else if (t.match(/^\s*while\s*\(/)) {
          const cm = t.match(/while\s*\((.+?)\)/);
          let res = '?';
          if (cm) {
            try {
              let e = cm[1];
              for (const [k, v] of Object.entries(mem)) e = e.replace(new RegExp('\\b' + k + '\\b', 'g'), v);
              res = Function('"use strict"; return (' + e + ')')() ? 'YES → enter loop' : 'NO → skip loop';
            } catch (x) {}
          }
          narr = cm ? `While: ${cm[1]} → ${res}` : 'Loop check.';
          expl = 'Like a nurse doing hourly checks — keep going while the condition holds.';
        }
        // increment
        else if (t.match(/(\w+)\s*\+\+/)) {
          const vm = t.match(/(\w+)\s*\+\+/);
          if (vm && mem[vm[1]] !== undefined) {
            mem = { ...mem, [vm[1]]: String(parseInt(mem[vm[1]]) + 1) };
            narr = `${vm[1]}++ → now ${mem[vm[1]]}`;
          } else {
            narr = 'Adding 1 to a counter.';
          }
        }
        // for
        else if (t.match(/^\s*for\s*\(/)) {
          narr = 'Starting a counting loop.';
          expl = 'Like checking each bed in a ward, one by one.';
        }
        // generic
        else {
          narr = `Running: ${t.substring(0, 55)}`;
        }
      }

      steps.push({ line: i, memory: { ...mem }, output: out, narration: narr, explain: expl });
    });

    return steps;
  }

  function buildCard(codeLines, steps) {
    const card = document.createElement('div');
    card.className = 'medjava-sim-card';

    const codeHtml = codeLines.map((l, i) =>
      `<div class="xl" style="padding:3px 8px;border-radius:5px;color:#4a5568;transition:all 0.25s;white-space:pre-wrap;word-wrap:break-word;min-height:18px;border-left:3px solid transparent;font-family:'JetBrains Mono',Consolas,monospace;font-size:11px">${escH(l)}</div>`
    ).join('');

    card.innerHTML = `
      <div class="card-header">
        <span style="color:var(--mj-muted);font-size:0.8rem"><i class="fas fa-play-circle"></i> Execution Walkthrough</span>
        <span style="background:linear-gradient(135deg,#2563EB,#1d4ed8);color:#fff;font-size:0.65rem;padding:3px 10px;border-radius:12px;font-weight:600">stepper</span>
      </div>
      <div style="font-family:'DM Sans',system-ui,sans-serif;background:#0f1629;border-radius:0 0 12px 12px;padding:14px;color:#e2e8f0">
        <div style="background:#080d1a;border-radius:10px;padding:10px;margin-bottom:10px;line-height:1.9;overflow-x:auto;max-height:250px;overflow-y:auto">${codeHtml}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div style="background:linear-gradient(135deg,#0a1f12,#122b1a);border:1px solid #1a5c2a;border-radius:10px;padding:10px;min-height:50px">
            <div style="font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#4ade80;margin-bottom:6px;font-weight:700">⬢ Memory</div>
            <div class="xmc" style="color:#555;font-size:11px;font-style:italic">No variables yet</div>
          </div>
          <div style="background:linear-gradient(135deg,#0a1220,#101d35);border:1px solid #1e3a5f;border-radius:10px;padding:10px;min-height:50px">
            <div style="font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#38bdf8;margin-bottom:6px;font-weight:700">⬢ Screen Output</div>
            <pre class="xot" style="margin:0;color:#7dd3fc;font-family:monospace;font-size:11px;white-space:pre-wrap;word-wrap:break-word">(nothing yet)</pre>
          </div>
        </div>
        <div style="background:linear-gradient(135deg,#1f1806,#2a2010);border:1px solid #78630e;border-radius:10px;padding:12px;margin-bottom:6px">
          <div style="font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#fbbf24;margin-bottom:4px;font-weight:700">⬢ What's Happening</div>
          <div class="xnt" style="color:#fde68a;font-size:12px;line-height:1.5;font-weight:500">Click Next → or ▶ Play to start the walkthrough.</div>
        </div>
        <div class="xet" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:10px;margin-bottom:10px;color:#94a3b8;font-size:11px;line-height:1.5;display:none"></div>
        <div class="xdc" style="display:flex;justify-content:center;gap:4px;margin:8px 0;flex-wrap:wrap"></div>
        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px">
          <span style="font-size:9px;color:#64748b;font-weight:600">Speed:</span>
          <input type="range" class="xsp" min="1" max="5" value="2" style="width:80px;accent-color:#60a5fa;cursor:pointer">
          <span class="xsv" style="font-size:9px;color:#60a5fa;font-weight:700">2x</span>
        </div>
        <div style="display:flex;justify-content:center;align-items:center;gap:6px;flex-wrap:wrap">
          <button class="xbk" style="padding:7px 18px;border-radius:18px;border:none;font-weight:700;cursor:pointer;font-size:11px;background:#334155;color:#94a3b8;font-family:inherit">← Back</button>
          <button class="xpl" style="padding:7px 18px;border-radius:18px;border:none;font-weight:700;cursor:pointer;font-size:11px;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;font-family:inherit">▶ Play</button>
          <span class="xsl" style="color:#64748b;font-size:10px;font-weight:600;min-width:60px;text-align:center">Step 1 / ${steps.length}</span>
          <button class="xnx" style="padding:7px 18px;border-radius:18px;border:none;font-weight:700;cursor:pointer;font-size:11px;background:linear-gradient(135deg,#2563EB,#1d4ed8);color:#fff;font-family:inherit">Next →</button>
        </div>
      </div>`;

    // Build dots
    const dc = card.querySelector('.xdc');
    steps.forEach(() => {
      const d = document.createElement('div');
      d.style.cssText = 'width:6px;height:6px;border-radius:50%;background:#334155;transition:all 0.3s';
      dc.appendChild(d);
    });

    // Wire up controls
    let cur = 0, playing = false, tmr = null;
    const aL = card.querySelectorAll('.xl');
    const mC = card.querySelector('.xmc');
    const oT = card.querySelector('.xot');
    const nT = card.querySelector('.xnt');
    const eT = card.querySelector('.xet');
    const sL = card.querySelector('.xsl');
    const pB = card.querySelector('.xpl');
    const nB = card.querySelector('.xnx');
    const bB = card.querySelector('.xbk');
    const spS = card.querySelector('.xsp');
    const spV = card.querySelector('.xsv');

    function gd() { return [3000, 2000, 1200, 700, 400][(parseInt(spS.value) || 2) - 1] || 2000; }

    function render() {
      const s = steps[cur];
      aL.forEach((el, i) => {
        if (i === s.line) {
          el.style.background = 'linear-gradient(90deg,#1e40af,#1d4ed8)';
          el.style.color = '#fff';
          el.style.fontWeight = '600';
          el.style.borderLeft = '3px solid #fbbf24';
        } else {
          el.style.background = 'transparent';
          el.style.color = '#4a5568';
          el.style.fontWeight = 'normal';
          el.style.borderLeft = '3px solid transparent';
        }
      });
      if (aL[s.line]) aL[s.line].scrollIntoView({ block: 'nearest', behavior: 'smooth' });

      const ent = Object.entries(s.memory);
      mC.innerHTML = ent.length === 0
        ? '<div style="color:#555;font-size:11px;font-style:italic">No variables yet</div>'
        : ent.map(([k, v]) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px;margin:2px 0;background:rgba(74,222,128,0.07);border-radius:6px;border:1px solid rgba(74,222,128,0.12);flex-wrap:wrap;gap:3px"><span style="font-weight:600;color:#4ade80;font-family:monospace;font-size:10px">${escH(k)}</span><span style="color:#60a5fa;font-family:monospace;font-weight:700;font-size:10px;background:rgba(96,165,250,0.1);padding:1px 8px;border-radius:8px;word-break:break-all">${escH(String(v))}</span></div>`).join('');

      oT.textContent = s.output || '(nothing yet)';
      nT.textContent = s.narration;
      if (s.explain) { eT.textContent = s.explain; eT.style.display = 'block'; }
      else { eT.style.display = 'none'; }
      sL.textContent = `Step ${cur + 1} / ${steps.length}`;

      const dots = dc.children;
      for (let i = 0; i < dots.length; i++) {
        dots[i].style.background = i < cur ? '#4ade80' : i === cur ? '#60a5fa' : '#334155';
        dots[i].style.boxShadow = i === cur ? '0 0 6px rgba(96,165,250,0.4)' : 'none';
      }
      if (cur >= steps.length - 1) stopP();
    }

    function adv() { if (cur < steps.length - 1) { cur++; render(); } else stopP(); }
    function stopP() {
      playing = false;
      if (tmr) { clearInterval(tmr); tmr = null; }
      pB.textContent = '▶ Play';
      pB.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
    }

    nB.addEventListener('click', e => { e.stopPropagation(); stopP(); if (cur < steps.length - 1) { cur++; render(); } });
    bB.addEventListener('click', e => { e.stopPropagation(); stopP(); if (cur > 0) { cur--; render(); } });
    pB.addEventListener('click', e => {
      e.stopPropagation();
      if (playing) { stopP(); }
      else {
        if (cur >= steps.length - 1) cur = 0;
        playing = true;
        pB.textContent = '⏸ Pause';
        pB.style.background = 'linear-gradient(135deg,#dc2626,#b91c1c)';
        tmr = setInterval(adv, gd());
      }
    });
    spS.addEventListener('input', () => {
      spV.textContent = spS.value + 'x';
      if (playing) { clearInterval(tmr); tmr = setInterval(adv, gd()); }
    });

    // Responsive
    if (window.innerWidth < 500) {
      const panels = card.querySelectorAll('[style*="grid-template-columns"]');
      panels.forEach(p => p.style.gridTemplateColumns = '1fr');
    }

    render();
    return card;
  }

  return { extractSims, processMessage };
})();
