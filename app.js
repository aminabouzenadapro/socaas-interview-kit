/* SOCaaS interview kit — no build step, no backend. Data lives in this browser (localStorage). */
(function () {
  "use strict";
  const { Q, PROFILES, HYPS, BMC, RULES, CONSENT, PRICING } = window.DATA;
  const PROF = Object.fromEntries(PROFILES.map(p => [p.id, p]));
  const LS = "socdz.interviews.v1", LSL = "socdz.lang";

  // Fail loudly if a profile references a question that does not exist.
  PROFILES.forEach(p => p.sections.forEach(s => (s.qs || []).forEach(id => { if (!Q[id]) console.error("Missing question", id, "in", p.id); })));

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  };
  let lang = store.get(LSL) === "en" ? "en" : "fr";
  let DB = (() => { try { return JSON.parse(store.get(LS)) || []; } catch (e) { return []; } })();
  DB.forEach(iv => Object.keys(iv.answers || {}).forEach(id => {
    const q = Q[id], a = iv.answers[id]; if (!q || !a || a.v === undefined || a.v === null) return;
    const ok = q.type === "multi" ? Array.isArray(a.v) : (q.type === "single" || q.type === "scale" || q.type === "num") ? typeof a.v === "number" : q.type === "yn" ? ["y", "n", "u"].includes(a.v) : true;
    if (!ok) { a.n = [String(a.v), a.n].filter(Boolean).join("\n"); delete a.v; }
  }));
  const persist = () => store.set(LS, JSON.stringify(DB));

  const L = a => Array.isArray(a) ? a[lang === "fr" ? 0 : 1] : a;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => Math.round(n).toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const UI = {
    brand: ["Kit d'entretiens SOC", "SOC interview kit"],
    nav_home: ["Guides", "Guides"], nav_list: ["Entretiens", "Interviews"], nav_ins: ["Synthèse", "Insights"], nav_price: ["Simulateur de prix", "Price simulator"],
    hero_t: ["Étude de marché : entretiens terrain", "Market study: field interviews"],
    hero_s: ["Des entretiens de 10 à 15 minutes : 6 à 9 questions par profil, toutes à cocher (avec « Autre » si besoin), sans présenter le projet, et une synthèse qui alimente le Business Model Canvas.", "Interviews of 10 to 15 minutes: 6 to 9 questions per profile, all tick-the-box (with « Other » when needed), without presenting the project, and a summary that feeds the Business Model Canvas."],
    start: ["Démarrer un entretien", "Start an interview"], preview: ["Voir le guide", "View the guide"],
    min: ["min", "min"], questions: ["questions", "questions"], done_n: ["réalisés", "done"],
    rules: ["Règles d'or de l'entretien", "Golden rules of interviewing"],
    who: ["Qui", "Who"], goal: ["Objectif", "Goal"],
    intro: ["Introduction à lire", "Introduction to read out"],
    pitch: ["Présentez maintenant le projet (30 secondes)", "Now pitch the project (30 seconds)"],
    pitch_warn: ["Pas avant ce point : les réponses précédentes doivent rester spontanées.", "Not before this point: earlier answers must stay spontaneous."],
    open_sim: ["Ouvrir le simulateur de prix", "Open the price simulator"],
    meta: ["Fiche de l'interlocuteur", "Interviewee details"],
    m_name: ["Nom", "Name"], m_role: ["Fonction", "Job title"], m_company: ["Organisation", "Organisation"], m_sector: ["Secteur", "Sector"],
    m_size: ["Nombre d'utilisateurs", "Number of users"], m_wilaya: ["Wilaya", "Wilaya"], m_date: ["Date", "Date"], m_mode: ["Format", "Format"],
    m_team: ["Intervieweurs", "Interviewers"], m_contact: ["Contact (tél. / e-mail)", "Contact (phone / email)"],
    mode_o: [["En personne", "In person"], ["En ligne", "Online"], ["Téléphone", "Phone"]],
    notes: ["Notes, citations…", "Notes, quotes…"], answer: ["Réponse…", "Answer…"],
    other: ["Autre", "Other"], other_ph: ["Précisez…", "Specify…"],
    yes: ["Oui", "Yes"], no: ["Non", "No"], unk: ["Ne sait pas", "Doesn't know"],
    saved: ["Enregistré", "Saved"], save_fail: ["Échec de l'enregistrement local", "Local save failed"],
    finish: ["Terminer l'entretien", "Finish the interview"], reopen: ["Modifier", "Edit"], report: ["Compte rendu", "Report"],
    print: ["Imprimer / PDF", "Print / PDF"], del: ["Supprimer", "Delete"], open: ["Ouvrir", "Open"],
    del_confirm: ["Supprimer définitivement cet entretien ?", "Permanently delete this interview?"],
    unnamed: ["Sans nom", "Unnamed"], st_draft: ["En cours", "In progress"], st_done: ["Terminé", "Completed"],
    none_yet: ["Aucun entretien pour l'instant. Choisissez un profil dans « Guides » pour commencer.", "No interviews yet. Pick a profile in « Guides » to start."],
    exp_json: ["Exporter (JSON)", "Export (JSON)"], exp_csv: ["Exporter (CSV Excel)", "Export (Excel CSV)"], imp: ["Importer (JSON)", "Import (JSON)"],
    imp_done: ["entretien(s) importé(s) ou mis à jour.", "interview(s) imported or updated."], imp_bad: ["Fichier illisible.", "Unreadable file."],
    sync_note: ["Les données restent dans ce navigateur. Pour les partager entre membres de l'équipe : exportez en JSON, puis importez sur l'autre appareil (les fiches sont fusionnées).", "Data stays in this browser. To share across the team: export as JSON, then import on the other device (records are merged)."],
    all_prof: ["Tous les profils", "All profiles"],
    k_total: ["Entretiens", "Interviews"], k_done: ["Terminés", "Completed"], k_int: ["Ont subi un incident", "Had an incident"], k_wtp: ["Budget de 15 000 DA ou plus", "Budget of 15,000 DA or more"],
    k_pilot: ["Essai gratuit accepté", "Free trial accepted"], k_strong: ["Signaux forts", "Strong signals"],
    hyp: ["Hypothèses à valider", "Hypotheses to validate"], hyp_n: ["réponses vont dans ce sens", "answers support this"],
    v_ok: ["Validée", "Validated"], v_no: ["Invalidée", "Invalidated"], v_mix: ["Mitigée", "Mixed"], v_few: ["Pas assez de données", "Not enough data"],
    hyp_note: ["Verdict à partir de 5 réponses : validée à 60 % ou plus, invalidée à 40 % ou moins.", "Verdict from 5 answers: validated at 60% or more, invalidated at 40% or less."],
    dist: ["Réponses chiffrées", "Structured answers"], bmc: ["Matière pour le Business Model Canvas", "Evidence for the Business Model Canvas"],
    bmc_s: ["Notes et citations classées par bloc, avec la source.", "Notes and quotes grouped by block, with the source."],
    resp: ["réponses", "answers"], median: ["médiane", "median"], empty: ["Rien pour l'instant.", "Nothing yet."],
    p_users: ["Nombre d'utilisateurs", "Number of users"], p_core: ["Surveillance de base", "Core monitoring"], p_per_user: ["par utilisateur", "per user"],
    p_sites: ["Sites web surveillés", "Monitored websites"], p_camp: ["Campagnes de phishing", "Phishing campaigns"],
    p_addons: ["Services au choix", "Optional services"], p_oneoff: ["Prestations ponctuelles", "One-off services"], p_terms: ["Engagement", "Commitment"],
    p_c0: ["Mensuel sans engagement", "Monthly, no commitment"], p_c1: ["12 mois (−10 %, frais d'installation offerts)", "12 months (−10%, setup fee waived)"], p_c2: ["Prépaiement annuel (−15 %, frais d'installation offerts)", "Annual prepayment (−15%, setup fee waived)"],
    p_startup: ["Startup, école ou université (−20 %, la meilleure remise s'applique)", "Startup, school or university (−20%, best discount applies)"],
    p_monthly: ["Total mensuel HT", "Monthly total excl. tax"], p_setup: ["Frais d'installation (une fois)", "Setup fee (one-time)"], p_once: ["Ponctuel", "One-off"],
    p_disc: ["Remise", "Discount"], p_quote: ["Au-delà de 250 utilisateurs, banques et organismes publics : sur devis.", "Above 250 users, banks and public bodies: on quote."],
    p_note: ["Prix de départ à tester avec les premiers clients. Notez la réaction dans la fiche d'entretien.", "Starting prices to test with first clients. Record the reaction in the interview form."],
    back: ["Retour", "Back"], notfound: ["Page introuvable.", "Page not found."], da: ["DA", "DA"],
    privacy: ["Les fiches contiennent des données personnelles : ne publiez pas vos exports.", "Records contain personal data: do not publish your exports."]
  };
  const t = k => L(UI[k]) || k;

  /* ---------- helpers on interviews ---------- */
  const profQs = p => p.sections.flatMap(s => s.qs || []).map(id => Q[id]);
  const askCount = p => p.sections.filter(s => !s.team).flatMap(s => s.qs || []).length;
  const USED = Object.values(Q).filter(q => PROFILES.some(p => profQs(p).includes(q)));
  const hasV = v => Array.isArray(v) ? v.length > 0 : (v !== undefined && v !== null && v !== "");
  const isAnswered = (iv, q) => { const a = iv.answers[q.id]; return !!a && (hasV(a.v) || !!(a.n && a.n.trim())); };
  const progress = iv => { const qs = profQs(PROF[iv.profile]); return [qs.filter(q => isAnswered(iv, q)).length, qs.length]; };
  const OTHER = 99;
  const valLabel = (q, v, o) => {
    if (!hasV(v)) return "";
    const lab = i => i === OTHER ? t("other") + (o ? " : " + o : "") : (L(q.o[i]) || "");
    switch (q.type) {
      case "single": return lab(v);
      case "multi": return v.map(lab).join(" · ");
      case "yn": return v === "y" ? t("yes") : v === "n" ? t("no") : t("unk");
      case "scale": return v + " / 5";
      case "num": return fmt(v) + (q.unit ? " " + q.unit : "");
      default: return String(v);
    }
  };
  const who = iv => [iv.meta.name || t("unnamed"), iv.meta.company].filter(Boolean).join(", ");
  const median = a => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const download = (name, text, type) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  /* ---------- shell ---------- */
  const app = $("#app");
  let cur = null, tick = null, saveT = null, insFilter = "all";

  function shell(route) {
    document.documentElement.lang = lang;
    document.title = t("brand");
    const link = (h, k, r) => `<a href="#/${h}" class="${route === r ? "on" : ""}">${t(k)}</a>`;
    $("#top").innerHTML = `<a class="brand" href="#/"><span class="logo">🛡️</span>${t("brand")}</a>
      <nav>${link("", "nav_home", "home")}${link("interviews", "nav_list", "interviews")}${link("insights", "nav_ins", "insights")}</nav>
      <button class="btn ghost sm" data-act="lang" aria-label="Language">${lang === "fr" ? "EN" : "FR"}</button>`;
  }

  function render() {
    clearInterval(tick); tick = null; flush(); cur = null;
    const [r, arg] = location.hash.replace(/^#\/?/, "").split("/");
    const route = r || "home";
    shell(route === "guide" ? "home" : (route === "interview" || route === "report") ? "interviews" : route);
    const views = { home: vHome, guide: vGuide, interview: vInterview, report: vReport, interviews: vList, insights: vInsights, pricing: vPricing };
    app.innerHTML = (views[route] || (() => `<p class="empty">${t("notfound")}</p>`))(arg);
    if (route === "pricing") drawQuote();
    if (route === "interview" && cur) { updateProgress(); drawTimer(); }
  }

  /* ---------- home ---------- */
  function vHome() {
    const cards = PROFILES.map(p => {
      const n = DB.filter(i => i.profile === p.id).length;
      return `<article class="card prof">
        <div class="prof-h"><span class="ico">${p.icon}</span><h3>${L(p.n)}</h3></div>
        <p class="muted">${L(p.who)}</p>
        <p><b>${t("goal")} :</b> ${L(p.goal)}</p>
        <p class="tags"><span>⏱ ${p.dur} ${t("min")}</span><span>${askCount(p)} ${t("questions")}</span>${n ? `<span class="ok">${n} ${t("done_n")}</span>` : ""}</p>
        <div class="row"><button class="btn" data-act="start" data-id="${p.id}">${t("start")}</button><a class="btn ghost" href="#/guide/${p.id}">${t("preview")}</a></div>
      </article>`;
    }).join("");
    return `<header class="hero"><h1>${t("hero_t")}</h1><p>${t("hero_s")}</p></header>
      <div class="grid">${cards}</div>
      <section class="card rules"><h2>${t("rules")}</h2><ol>${RULES.map(r => `<li>${L(r)}</li>`).join("")}</ol></section>`;
  }

  /* ---------- question rendering ---------- */
  const chip = (v, label, on) => `<button type="button" class="chip${on ? " on" : ""}" data-act="opt" data-v="${v}" aria-pressed="${on ? "true" : "false"}">${label}</button>`;
  function inputHTML(q, a) {
    const v = a.v, has = i => q.type === "multi" ? Array.isArray(v) && v.includes(i) : v === i;
    const other = q.noOther ? "" : chip(OTHER, t("other") + "…", has(OTHER));
    const otherIn = q.noOther ? "" : `<input type="text" class="other" data-other placeholder="${t("other_ph")}" aria-label="${t("other")}" value="${esc(a.o)}"${has(OTHER) ? "" : " hidden"}>`;
    switch (q.type) {
      case "single": return `<div class="chips">${q.o.map((o, i) => chip(i, L(o), has(i))).join("")}${other}</div>${otherIn}`;
      case "multi": return `<div class="chips multi">${q.o.map((o, i) => chip(i, L(o), has(i))).join("")}${other}</div>${otherIn}`;
      case "yn": return `<div class="chips">${chip("y", t("yes"), v === "y")}${chip("n", t("no"), v === "n")}${chip("u", t("unk"), v === "u")}</div>`;
      case "scale": return `<div class="chips scale">${[1, 2, 3, 4, 5].map(i => chip(i, i, v === i)).join("")}</div>`;
      case "num": return `<div class="num"><input type="number" inputmode="numeric" min="0" step="1000" data-val value="${hasV(v) ? esc(v) : ""}" aria-label="${esc(L(q.t))}"> <span>${q.unit || ""}</span></div>`;
      default: return `<textarea data-val rows="3" placeholder="${t("answer")}" aria-label="${esc(L(q.t))}">${esc(v)}</textarea>`;
    }
  }
  function qHTML(q, a, n, readonly) {
    const opts = readonly && q.o ? `<p class="q-opts">${q.o.map(o => `<span>${L(o)}</span>`).join("")}${q.noOther ? "" : `<span>${t("other")}…</span>`}</p>` : "";
    return `<div class="q" data-q="${q.id}">
      <div class="q-head"><span class="q-num">${n}</span><div>
        <p class="q-text">${L(q.t)}</p>
        ${q.h ? `<p class="q-hint">↳ ${L(q.h)}</p>` : ""}</div></div>
      ${readonly ? opts : inputHTML(q, a) + (q.type === "text" ? "" : `<textarea data-note rows="1" placeholder="${t("notes")}" aria-label="${t("notes")}">${esc(a.n)}</textarea>`)}
    </div>`;
  }
  const pitchHTML = s => `<aside class="pitch"><h3>📣 ${t("pitch")}</h3><p class="warn">${t("pitch_warn")}</p><blockquote>${L(s.pitch)}</blockquote>
    ${s.sim ? `<a class="btn ghost sm noprint" href="#/pricing" target="_blank" rel="noopener">${t("open_sim")} ↗</a>` : ""}</aside>`;
  function sectionsHTML(p, iv) {
    let n = 0;
    return p.sections.map((s, i) => s.pitch ? pitchHTML(s) : `<section class="sec card" id="sec${i}"><h2>${L(s.t)}</h2>
      ${s.note ? `<p class="muted">${L(s.note)}</p>` : ""}
      ${s.qs.map(id => qHTML(Q[id], iv ? (iv.answers[id] || {}) : {}, ++n, !iv)).join("")}</section>`).join("");
  }
  const consentHTML = p => `<details class="card intro" open><summary>${t("intro")}</summary><p>${L(CONSENT).replace("{d}", p.dur)}</p></details>`;

  /* ---------- guide preview ---------- */
  function vGuide(pid) {
    const p = PROF[pid]; if (!p) return `<p class="empty">${t("notfound")}</p>`;
    return `<header class="page-h"><div><a class="back noprint" href="#/">← ${t("back")}</a><h1>${p.icon} ${L(p.n)}</h1>
        <p class="muted">${L(p.who)}</p><p><b>${t("goal")} :</b> ${L(p.goal)} · ⏱ ${p.dur} ${t("min")}</p></div>
        <div class="row noprint"><button class="btn" data-act="start" data-id="${p.id}">${t("start")}</button><button class="btn ghost" data-act="print">${t("print")}</button></div></header>
      ${consentHTML(p)}${sectionsHTML(p, null)}`;
  }

  /* ---------- interview ---------- */
  const META = [["name", "text"], ["role", "text"], ["company", "text"], ["sector", "text"], ["size", "number"], ["wilaya", "text"], ["date", "date"], ["contact", "text"]];
  function vInterview(id) {
    const iv = DB.find(x => x.id === id); if (!iv) return `<p class="empty">${t("notfound")}</p>`;
    cur = iv; const p = PROF[iv.profile];
    const meta = META.map(([k, ty]) => `<label>${t("m_" + k)}${ty === "select"
      ? `<select data-meta="${k}">${UI.mode_o.map((o, i) => `<option value="${i}"${String(iv.meta[k]) === String(i) ? " selected" : ""}>${L(o)}</option>`).join("")}</select>`
      : `<input type="${ty}" data-meta="${k}" value="${esc(iv.meta[k])}"${ty === "number" ? ' min="1" inputmode="numeric"' : ""}>`}</label>`).join("");
    const secNav = p.sections.map((s, i) => s.pitch ? `<button class="chip pitchchip" data-act="scroll" data-id="pitch">📣</button>` : `<button class="chip" data-act="scroll" data-id="sec${i}">${L(s.t)}</button>`).join("");
    return `<div class="bar noprint" id="bar">
        <div class="bar-l"><b id="who">${esc(who(iv))}</b><span class="muted">${p.icon} ${L(p.n)}</span></div>
        <div class="bar-r"><button class="btn ghost sm" data-act="timer" id="timer" aria-label="Timer">⏱ 00:00</button>
          <span id="prog" class="muted"></span><span id="saved" class="saved"></span></div>
        <div class="progress"><i id="progbar"></i></div>
        <div class="secnav">${secNav}</div>
      </div>
      <div class="iv" id="iv">
      <details class="card meta"><summary>${t("meta")}</summary><div class="form">${meta}</div></details>
      ${consentHTML(p)}${sectionsHTML(p, iv).replace('<aside class="pitch">', '<aside class="pitch" id="pitch">')}
      <div class="row end noprint"><button class="btn" data-act="finish">${t("finish")} ✓</button></div></div>`;
  }
  function updateProgress() {
    if (!cur) return; const [a, n] = progress(cur);
    const el = $("#prog"); if (el) el.textContent = a + " / " + n;
    const b = $("#progbar"); if (b) b.style.width = (n ? 100 * a / n : 0) + "%";
  }
  function drawTimer() {
    const el = $("#timer"); if (!el || !cur) return; const s = cur.elapsed || 0;
    el.textContent = (tick ? "⏸ " : "⏱ ") + String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    el.classList.toggle("run", !!tick);
  }
  function touch() {
    if (!cur) return; cur.updated = Date.now();
    clearTimeout(saveT); saveT = setTimeout(flush, 400);
  }
  function flush() {
    clearTimeout(saveT); saveT = null;
    const ok = persist(); const el = $("#saved");
    if (el) { el.textContent = ok ? "✓ " + t("saved") : "⚠ " + t("save_fail"); el.classList.toggle("bad", !ok); }
  }

  /* ---------- report ---------- */
  function vReport(id) {
    const iv = DB.find(x => x.id === id); if (!iv) return `<p class="empty">${t("notfound")}</p>`;
    const p = PROF[iv.profile], m = iv.meta;
    const rows = META.filter(([k]) => hasV(m[k])).map(([k]) => `<div><dt>${t("m_" + k)}</dt><dd>${esc(k === "mode" ? L(UI.mode_o[m[k]] || "") : m[k])}</dd></div>`).join("");
    const secs = p.sections.filter(s => s.qs).map(s => {
      const items = s.qs.map(qid => Q[qid]).filter(q => isAnswered(iv, q)).map(q => {
        const a = iv.answers[q.id];
        return `<div class="ra"><p class="q-text">${L(q.t)}</p>${hasV(a.v) ? `<p class="val">${esc(valLabel(q, a.v, a.o))}</p>` : ""}${a.n ? `<p class="note">${esc(a.n)}</p>` : ""}</div>`;
      }).join("");
      return items ? `<section class="sec card"><h2>${L(s.t)}</h2>${items}</section>` : "";
    }).join("");
    const [a, n] = progress(iv);
    return `<header class="page-h"><div><a class="back noprint" href="#/interviews">← ${t("back")}</a><h1>${esc(who(iv))}</h1>
        <p class="muted">${p.icon} ${L(p.n)} · ${a} / ${n} · ${iv.status === "done" ? t("st_done") : t("st_draft")}${iv.elapsed ? " · " + Math.round(iv.elapsed / 60) + " " + t("min") : ""}</p></div>
        <div class="row noprint"><a class="btn" href="#/interview/${iv.id}">${t("reopen")}</a><button class="btn ghost" data-act="print">${t("print")}</button></div></header>
      <dl class="card metalist">${rows}</dl>${secs || `<p class="empty">${t("empty")}</p>`}`;
  }

  /* ---------- list ---------- */
  function vList() {
    const items = DB.slice().sort((a, b) => b.updated - a.updated).map(iv => {
      const p = PROF[iv.profile], [a, n] = progress(iv), sig = iv.answers.d_signal && iv.answers.d_signal.v;
      return `<article class="card item">
        <div><h3><a href="#/interview/${iv.id}">${esc(who(iv))}</a></h3>
          <p class="muted">${p.icon} ${L(p.n)}${iv.meta.date ? " · " + esc(iv.meta.date) : ""}${iv.meta.wilaya ? " · " + esc(iv.meta.wilaya) : ""}</p>
          <p class="tags"><span class="${iv.status === "done" ? "ok" : ""}">${iv.status === "done" ? t("st_done") : t("st_draft")}</span><span>${a} / ${n}</span>${hasV(sig) ? `<span class="sig${sig}">${L(Q.d_signal.o[sig]).split(" :")[0].split(":")[0]}</span>` : ""}</p></div>
        <div class="row"><a class="btn sm" href="#/interview/${iv.id}">${t("open")}</a><a class="btn ghost sm" href="#/report/${iv.id}">${t("report")}</a>
          <button class="btn ghost sm danger" data-act="del" data-id="${iv.id}">${t("del")}</button></div></article>`;
    }).join("");
    return `<header class="page-h"><h1>${t("nav_list")} <span class="count">${DB.length}</span></h1>
        <div class="row"><button class="btn ghost sm" data-act="expJson">${t("exp_json")}</button><button class="btn ghost sm" data-act="expCsv">${t("exp_csv")}</button>
          <label class="btn ghost sm">${t("imp")}<input type="file" id="imp" accept="application/json,.json" hidden></label></div></header>
      <p class="callout">${t("sync_note")} ${t("privacy")}</p>
      ${items || `<p class="empty">${t("none_yet")}</p>`}`;
  }
  function exportCsv() {
    const qs = USED, cell = x => '"' + String(x == null ? "" : x).replace(/"/g, '""') + '"';
    const head = ["id", "profile", "status", "minutes"].concat(META.map(m => m[0]), qs.flatMap(q => q.type === "text" ? [q.id] : [q.id, q.id + "_notes"]));
    const lines = DB.map(iv => [iv.id, L(PROF[iv.profile].n), iv.status, Math.round((iv.elapsed || 0) / 60)]
      .concat(META.map(([k]) => k === "mode" ? L(UI.mode_o[iv.meta[k]] || "") : iv.meta[k]),
        qs.flatMap(q => { const a = iv.answers[q.id] || {}; return q.type === "text" ? [a.v] : [valLabel(q, a.v, a.o), a.n]; })).map(cell).join(";"));
    const labels = ["", "", "", ""].concat(META.map(m => t("m_" + m[0])), qs.flatMap(q => q.type === "text" ? [L(q.t)] : [L(q.t), ""])).map(cell).join(";");
    download("soc-interviews-" + today() + ".csv", "﻿" + [head.map(cell).join(";"), labels].concat(lines).join("\r\n"), "text/csv;charset=utf-8");
  }
  function importJson(file) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const arr = JSON.parse(fr.result); let n = 0;
        if (!Array.isArray(arr)) throw 0;
        arr.forEach(x => {
          if (!x || !x.id || !PROF[x.profile] || typeof x.answers !== "object") return;
          x.meta = x.meta || {};
          const i = DB.findIndex(y => y.id === x.id);
          if (i < 0) { DB.push(x); n++; } else if ((x.updated || 0) > (DB[i].updated || 0)) { DB[i] = x; n++; }
        });
        persist(); alert(n + " " + t("imp_done")); render();
      } catch (e) { alert(t("imp_bad")); }
    };
    fr.readAsText(file);
  }

  /* ---------- insights ---------- */
  function vInsights() {
    const set = DB.filter(i => insFilter === "all" || i.profile === insFilter);
    const vals = id => set.map(i => i.answers[id] && i.answers[id].v).filter(hasV);
    const kI = vals("p_incident"), kW = vals("o_budget"), kP = vals("o_pilot");
    const kpi = (k, v) => `<div class="kpi"><b>${v}</b><span>${t(k)}</span></div>`;
    const kpis = kpi("k_total", set.length) + kpi("k_done", set.filter(i => i.status === "done").length)
      + kpi("k_int", kI.length ? kI.filter(v => v === "y").length + " / " + kI.length : "–")
      + kpi("k_wtp", kW.length ? kW.filter(Q.o_budget.sup).length + " / " + kW.length : "–")
      + kpi("k_pilot", kP.length ? kP.filter(v => v === "y").length + " / " + kP.length : "–")
      + kpi("k_strong", vals("d_signal").filter(v => v === 0).length);

    const hyps = HYPS.map(h => {
      let tot = 0, sup = 0;
      USED.forEach(q => { const f = q.hyp === h.id ? q.sup : q.hyps && q.hyps[h.id]; if (f) vals(q.id).forEach(v => { tot++; if (f(v)) sup++; }); });
      const pct = tot ? Math.round(100 * sup / tot) : 0;
      const verdict = tot < 5 ? ["few", "v_few"] : pct >= 60 ? ["ok", "v_ok"] : pct <= 40 ? ["no", "v_no"] : ["mix", "v_mix"];
      return `<div class="hyp"><div class="hyp-h"><span><b>${h.id}</b> ${L(h.t)}</span><span class="verdict ${verdict[0]}">${t(verdict[1])}</span></div>
        <div class="meter"><i style="width:${pct}%"></i></div><p class="muted">${tot ? `${sup} / ${tot} ${t("hyp_n")} (${pct} %)` : t("empty")}</p></div>`;
    }).join("");

    const dist = Object.values(Q).filter(q => q.type !== "text").map(q => {
      const v = vals(q.id); if (!v.length) return "";
      let body;
      if (q.type === "num") body = `<p class="val">${t("median")} ${fmt(median(v))} ${q.unit || ""} <span class="muted">(min ${fmt(Math.min.apply(null, v))} · max ${fmt(Math.max.apply(null, v))})</span></p>`;
      else {
        const opts = q.type === "yn" ? [["y", t("yes")], ["n", t("no")], ["u", t("unk")]] : q.type === "scale" ? [1, 2, 3, 4, 5].map(i => [i, String(i)]) : q.o.map((o, i) => [i, L(o)]).concat(q.noOther ? [] : [[OTHER, t("other")]]);
        body = opts.map(([k, label]) => {
          const c = v.filter(x => q.type === "multi" ? x.includes(k) : x === k).length;
          return `<div class="bar-row"><span class="bl">${label}</span><span class="bt"><i style="width:${100 * c / v.length}%"></i></span><span class="bc">${c}</span></div>`;
        }).join("");
      }
      const others = set.map(i => i.answers[q.id]).filter(x => x && x.o && (q.type === "multi" ? (x.v || []).includes(OTHER) : x.v === OTHER)).map(x => `<li>${esc(x.o)}</li>`).join("");
      return `<div class="card dist"><h3>${L(q.t)}</h3><p class="muted">${v.length} ${t("resp")}</p>${body}${others ? `<ul class="others">${others}</ul>` : ""}</div>`;
    }).join("");

    const bmc = BMC.map(([tag, fr, en]) => {
      const items = set.flatMap(iv => Object.values(Q).filter(q => q.bmc === tag).map(q => {
        const a = iv.answers[q.id]; if (!a) return "";
        const txt = q.type === "text" ? a.v : [a.o, a.n].filter(x => x && String(x).trim()).join(" — "); if (!txt || !String(txt).trim()) return "";
        return `<li><span class="muted">${L(q.t)}</span><br>« ${esc(txt)} » <span class="src">— ${esc(who(iv))}</span></li>`;
      })).filter(Boolean);
      return `<details class="card bmc"${items.length ? " open" : ""}><summary>${L([fr, en])} <span class="count">${items.length}</span></summary>${items.length ? `<ul>${items.join("")}</ul>` : `<p class="muted">${t("empty")}</p>`}</details>`;
    }).join("");

    return `<header class="page-h"><h1>${t("nav_ins")}</h1><div class="row noprint">
        <select id="insf" aria-label="${t("all_prof")}"><option value="all">${t("all_prof")}</option>${PROFILES.map(p => `<option value="${p.id}"${insFilter === p.id ? " selected" : ""}>${L(p.n)}</option>`).join("")}</select>
        <button class="btn ghost sm" data-act="print">${t("print")}</button></div></header>
      <div class="kpis">${kpis}</div>
      <section class="card"><h2>${t("hyp")}</h2>${hyps}<p class="muted small">${t("hyp_note")}</p></section>
      <h2 class="h">${t("bmc")}</h2><p class="muted">${t("bmc_s")}</p>${bmc}
      <h2 class="h">${t("dist")}</h2><div class="grid">${dist || `<p class="empty">${t("empty")}</p>`}</div>`;
  }

  /* ---------- pricing ---------- */
  const ps = { users: 60, hunt: 0, ret: 0, ir: 0, sites: 0, phish: 0, commit: "none" };
  function quote(s) {
    const u = Math.max(1, Math.floor(Number(s.users) || 1));
    if (u > 250) return { onQuote: true };
    const tier = a => a.find(x => u <= x[0])[1], rate = tier(PRICING.tiers), lines = [], once = [];
    lines.push([`${t("p_core")} (${u} × ${fmt(rate)} DA)`, Math.max(u * rate, PRICING.min)]);
    PRICING.perUser.forEach(a => { if (s[a.id]) lines.push([L(a.t), a.p * u]); });
    PRICING.choices.forEach(c => { const o = c.o[s[c.id] || 0]; if (o[1]) lines.push([L(c.t) + " · " + L(o[0]), c.per === "user" ? o[1] * u : o[1]]); });
    PRICING.flat.forEach(a => { if (s[a.id]) lines.push([L(a.t), a.p]); });
    if (s.sites > 0) lines.push([t("p_sites") + " × " + s.sites, s.sites * PRICING.site]);
    PRICING.oneoff.forEach(a => { const n = a.id === "phish" ? (s.phish || 0) : (s[a.id] ? 1 : 0); if (n) once.push([L(a.t) + (n > 1 ? " × " + n : ""), a.p * n]); });
    const sub = lines.reduce((x, l) => x + l[1], 0);
    const disc = Math.max(s.commit === "12" ? 10 : s.commit === "pre" ? 15 : 0, s.startup ? 20 : 0);
    return { lines, once, sub, disc, monthly: Math.round(sub * (1 - disc / 100)), setup: s.commit === "none" ? tier(PRICING.setup) : 0 };
  }
  function vPricing() {
    const chk = a => `<label class="check"><input type="checkbox" data-p="${a.id}"${ps[a.id] ? " checked" : ""}> <span>${L(a.t)}</span><em>${a.per ? "" : "+"}${fmt(a.p)} DA${a.u ? " " + t("p_per_user") : ""}</em></label>`;
    const sel = c => `<label class="check sel"><span>${L(c.t)}</span><select data-p="${c.id}" data-int>${c.o.map((o, i) => `<option value="${i}"${ps[c.id] === i ? " selected" : ""}>${L(o[0])}${o[1] ? ` (+${fmt(o[1])} DA${c.per === "user" ? " " + t("p_per_user") : ""})` : ""}</option>`).join("")}</select></label>`;
    const numf = (id, label, price) => `<label class="check sel"><span>${label}</span><em>${fmt(price)} DA</em><input type="number" min="0" max="50" data-p="${id}" data-int value="${ps[id]}"></label>`;
    return `<header class="page-h"><h1>${t("nav_price")}</h1></header><p class="callout">${t("p_note")}</p>
      <div class="pricing"><form class="card" id="pform" onsubmit="return false">
        <label class="users">${t("p_users")}<input type="number" min="1" max="2000" data-p="users" data-int value="${ps.users}"></label>
        <h3>${t("p_addons")}</h3>
        ${PRICING.perUser.map(a => chk(Object.assign({ u: 1 }, a))).join("")}${PRICING.choices.map(sel).join("")}${PRICING.flat.map(chk).join("")}${numf("sites", t("p_sites"), PRICING.site)}
        <h3>${t("p_oneoff")}</h3>
        ${numf("phish", t("p_camp"), PRICING.oneoff[0].p)}${PRICING.oneoff.slice(1).map(chk).join("")}
        <h3>${t("p_terms")}</h3>
        <label class="check sel"><select data-p="commit"><option value="none">${t("p_c0")}</option><option value="12"${ps.commit === "12" ? " selected" : ""}>${t("p_c1")}</option><option value="pre"${ps.commit === "pre" ? " selected" : ""}>${t("p_c2")}</option></select></label>
        <label class="check"><input type="checkbox" data-p="startup"${ps.startup ? " checked" : ""}> <span>${t("p_startup")}</span></label>
      </form><aside class="card quote" id="quote" aria-live="polite"></aside></div>`;
  }
  function drawQuote() {
    const el = $("#quote"); if (!el) return; const r = quote(ps);
    if (r.onQuote) { el.innerHTML = `<p class="big">${t("p_quote")}</p>`; return; }
    const li = l => `<li><span>${l[0]}</span><b>${fmt(l[1])} DA</b></li>`;
    el.innerHTML = `<ul class="lines">${r.lines.map(li).join("")}${r.disc ? `<li class="disc"><span>${t("p_disc")} −${r.disc} %</span><b>−${fmt(r.sub - r.monthly)} DA</b></li>` : ""}</ul>
      <p class="total"><span>${t("p_monthly")}</span><b>${fmt(r.monthly)} DA</b></p>
      <p class="muted">≈ ${fmt(r.monthly / Math.max(1, Math.floor(ps.users)))} DA ${t("p_per_user")}</p>
      <ul class="lines">${r.setup ? li([t("p_setup"), r.setup]) : ""}${r.once.map(li).join("")}</ul>`;
  }

  /* ---------- events ---------- */
  const acts = {
    lang() { lang = lang === "fr" ? "en" : "fr"; store.set(LSL, lang); render(); },
    start(b) {
      const iv = { id: "iv" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), profile: b.dataset.id, status: "draft", meta: { date: today() }, answers: {}, elapsed: 0, created: Date.now(), updated: Date.now() };
      DB.push(iv); persist(); location.hash = "#/interview/" + iv.id;
    },
    opt(b) {
      if (!cur) return; const box = b.closest(".q"), q = Q[box.dataset.q], a = cur.answers[q.id] || (cur.answers[q.id] = {});
      const v = q.type === "yn" ? b.dataset.v : Number(b.dataset.v);
      if (q.type === "multi") { const arr = Array.isArray(a.v) ? a.v : []; a.v = arr.includes(v) ? arr.filter(x => x !== v) : arr.concat(v).sort((x, y) => x - y); }
      else a.v = a.v === v ? undefined : v;
      $$(".chip", box).forEach(c => { const cv = q.type === "yn" ? c.dataset.v : Number(c.dataset.v); const on = q.type === "multi" ? a.v.includes(cv) : a.v === cv; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
      const oi = $("[data-other]", box);
      if (oi) { const on = q.type === "multi" ? a.v.includes(OTHER) : a.v === OTHER; oi.hidden = !on; if (on && v === OTHER) oi.focus(); }
      touch(); updateProgress();
    },
    scroll(b) { const el = document.getElementById(b.dataset.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); },
    timer() {
      if (tick) { clearInterval(tick); tick = null; touch(); }
      else tick = setInterval(() => { cur.elapsed = (cur.elapsed || 0) + 1; drawTimer(); if (cur.elapsed % 15 === 0) touch(); }, 1000);
      drawTimer();
    },
    finish() { cur.status = "done"; const id = cur.id; touch(); flush(); location.hash = "#/report/" + id; },
    print() { window.print(); },
    del(b) { if (!confirm(t("del_confirm"))) return; DB = DB.filter(x => x.id !== b.dataset.id); persist(); render(); },
    expJson() { download("soc-interviews-" + today() + ".json", JSON.stringify(DB, null, 2), "application/json"); },
    expCsv: exportCsv
  };
  document.addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (b && acts[b.dataset.act]) acts[b.dataset.act](b); });
  document.addEventListener("input", e => {
    const el = e.target;
    if (el.dataset.p !== undefined) {
      ps[el.dataset.p] = el.type === "checkbox" ? el.checked : el.dataset.int !== undefined ? Math.max(0, parseInt(el.value, 10) || 0) : el.value;
      drawQuote(); return;
    }
    if (!cur) return;
    if (el.dataset.meta) { cur.meta[el.dataset.meta] = el.value; const w = $("#who"); if (w) w.textContent = who(cur); touch(); return; }
    const box = el.closest(".q"); if (!box) return;
    const q = Q[box.dataset.q], a = cur.answers[q.id] || (cur.answers[q.id] = {});
    if (el.dataset.other !== undefined) a.o = el.value;
    else if (el.dataset.note !== undefined) a.n = el.value;
    else if (el.dataset.val !== undefined) a.v = q.type === "num" ? (el.value === "" ? undefined : Number(el.value)) : el.value;
    if (el.tagName === "TEXTAREA") { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; }
    touch(); updateProgress();
  });
  document.addEventListener("change", e => {
    if (e.target.id === "insf") { insFilter = e.target.value; render(); }
    if (e.target.id === "imp" && e.target.files[0]) importJson(e.target.files[0]);
  });
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
  window.addEventListener("beforeunload", flush);
  document.addEventListener("visibilitychange", () => { if (document.hidden) flush(); });
  render();
})();
