// --- 1. CONFIGURAZIONE ---
const URL_APP_SCRIPT = "https://script.google.com/macros/s/AKfycbybMYie_2Uz-8L5l6dAJTYS_NVg5QLQeX_SzaRPU2R2ogwsK0qwx9IjPxqgTrkGZBJ0/exec";

const unitaOptions = [
    "Castorini", "Waingunga", "Dhak", "Vanguard",
    "Lezard", "Noviziato", "Clan", "Capogruppo", "Capo a disposizione", "Assistente ecclesiastico",
    "Lascia la coca"
];

const coloriUnita = {
    "Castorini": "#87CEEB",
    "Waingunga": "#FFD700",
    "Dhak": "#FFC107",
    "Vanguard": "#228B22",
    "Lezard": "#2E8B57",
    "Noviziato": "#DC143C",
    "Clan": "#B22222",
    "Capogruppo": "#8027F5",
    "Capo a disposizione": "#B47DFA",
    "Assistente ecclesiastico": "#e3e8c6",
    "Lascia la coca": "#827A7A"
};

// COMPILA QUI CON I NOMI REALI DELLA CO.CA.
// Se formAic è vuoto o assente, non verrà mostrato.
const coca = [
    { nome: "Giacomo", cognome: "Acerbo", formAgesci: "CFT", formAic: "" },
    { nome: "Giulio", cognome: "Acerbo", formAgesci: "CFM LC", formAic: "" },
    { nome: "Chiara", cognome: "Canepa", formAgesci: "CFT", formAic: "" },
    { nome: "Alessio", cognome: "Del Giallo", formAgesci: "CFT", formAic: "" },
    { nome: "Alessia", cognome: "Di Rienzo", formAgesci: "CFM RS", formAic: "" },
    { nome: "Davide", cognome: "Fassone", formAgesci: "CFM LC", formAic: "Verifica" },
    { nome: "Immacolata", cognome: "Fazio", formAgesci: "CFM EG, CAM RS", formAic: "" },
    { nome: "Andrea", cognome: "Fiori", formAgesci: "CFM LC", formAic: "" },
    { nome: "Pietro", cognome: "Galdi", formAgesci: "CFA", formAic: "Capo Castorini" },
    { nome: "Francesca", cognome: "Gasbarra", formAgesci: "CFM LC", formAic: "" },
    { nome: "Linda", cognome: "Gerbi", formAgesci: "CFM EG", formAic: "" },
    { nome: "Don", cognome: "Giovanni", formAgesci: "AE", formAic: "" },
    { nome: "Vittoria", cognome: "Mazzetto", formAgesci: "CFT", formAic: "Metodologico" },
    { nome: "Cristopher", cognome: "Navarrete", formAgesci: "CFM LC", formAic: "" },
    { nome: "Tommaso", cognome: "Parodi", formAgesci: "CFT", formAic: "" },
    { nome: "Caterina", cognome: "Pienovi", formAgesci: "Nomina a capo", formAic: "" },
    { nome: "Marko", cognome: "Poggi", formAgesci: "CFM LC", formAic: "" },
    { nome: "Alessia", cognome: "Polo Riva", formAgesci: "CFM LC", formAic: "" },
    { nome: "Antonio", cognome: "Sirsi", formAgesci: "CFM LC", formAic: "Metodologico" },
    { nome: "Francesco", cognome: "Tavian", formAgesci: "CFM EG", formAic: "" },
    { nome: "Simone", cognome: "Tavian", formAgesci: "CFM EG", formAic: "" },
    { nome: "Alessandra", cognome: "Vaccaro", formAgesci: "CFT", formAic: "Metodologico" },
    { nome: "Tito", cognome: "Vaccaro", formAgesci: "Nomina a capo", formAic: "" },
    { nome: "Caterina", cognome: "Vagge", formAgesci: "CFM LC", formAic: "" },
    { nome: "Matilde", cognome: "Vagge", formAgesci: "CFM EG", formAic: "" },
    { nome: "Luca", cognome: "Vicari", formAgesci: "CFT", formAic: "" },
    { nome: "Alice", cognome: "Villani", formAgesci: "CFT", formAic: "Metodologico" }
];

const charts = {};
const getPersonaId = (nome, cognome) => `${nome.trim()}_${cognome.trim()}`;

// --- 2. INIZIALIZZAZIONE DOM ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-vista-persona').addEventListener('click', () => impostaVista('persona'));
  document.getElementById('btn-vista-unita').addEventListener('click', () => impostaVista('unita'));

  document.getElementById('btn-vai-risultati').addEventListener('click', avviaModalitaRisultati);
  
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('view') === 'risultati') {
    avviaModalitaRisultati();
    return;
  }

  popolaMenuIdentificazione();
  generaInterfacciaVoto();
  document.getElementById('btn-invia').addEventListener('click', inviaDati);
});

function impostaVista(tipo) {
  const btnPersona = document.getElementById('btn-vista-persona');
  const btnUnita = document.getElementById('btn-vista-unita');
  const vistaPersona = document.getElementById('vista-persona');
  const vistaUnita = document.getElementById('vista-unita');

  if (tipo === 'persona') {
    btnPersona.classList.add('active');
    btnUnita.classList.remove('active');
    vistaPersona.style.display = 'block';
    vistaUnita.style.display = 'none';
  } else {
    btnUnita.classList.add('active');
    btnPersona.classList.remove('active');
    vistaUnita.style.display = 'block';
    vistaPersona.style.display = 'none';
  }
}

function popolaMenuIdentificazione() {
  const selectChiSei = document.getElementById("chi-sei");
  coca.forEach(persona => {
    const opt = document.createElement("option");
    opt.value = getPersonaId(persona.nome, persona.cognome);
    opt.innerText = `${persona.nome} ${persona.cognome}`;
    opt.dataset.nome = persona.nome;
    opt.dataset.cognome = persona.cognome;
    selectChiSei.appendChild(opt);
  });
}

function generaInterfacciaVoto() {
  const contenitoreLista = document.getElementById("lista-coca");
  
  coca.forEach(persona => {
    let optionsHtml = unitaOptions.map(u => `<option value="${u}">${u}</option>`).join('');
    const personaId = getPersonaId(persona.nome, persona.cognome);
    
    const agesciBadge = persona.formAgesci && persona.formAgesci.trim() !== "" 
      ? `<span class="badge badge-agesci">${persona.formAgesci}</span>` : "";
    const aicBadge = persona.formAic && persona.formAic.trim() !== "" 
      ? `<span class="badge badge-aic">${persona.formAic}</span>` : "";
    
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="info-persona">
        <div class="dettagli">
          <h3>${persona.nome} ${persona.cognome}</h3>
          <div class="badges-container">
            ${agesciBadge}
            ${aicBadge}
          </div>
        </div>
      </div>
      <select id="sel_${personaId}">
        <option value="" disabled selected>Seleziona servizio...</option>
        ${optionsHtml}
      </select>
    `;
    contenitoreLista.appendChild(card);
  });
}

// --- 3. INVIO DATI E MODALITÀ RISULTATI ---
function avviaModalitaRisultati() {
  document.getElementById("sezione-voto").style.display = "none";
  document.getElementById("sezione-risultati").style.display = "block";
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  preparaInterfacciaRisultati();
  scaricaEAggiorna(); 
  setInterval(scaricaEAggiorna, 3000); 
}

async function inviaDati() {
  const selectChiSei = document.getElementById("chi-sei");
  const optScelta = selectChiSei.options[selectChiSei.selectedIndex];
  
  if (!selectChiSei.value) {
    alert("Attenzione: Seleziona chi sei dal menù in alto prima di votare!");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const btn = document.getElementById("btn-invia");
  btn.disabled = true;
  btn.innerText = "Invio in corso...";

  const voti = [];
  let tuttiCompilati = true;

  coca.forEach(persona => {
    const personaId = getPersonaId(persona.nome, persona.cognome);
    const val = document.getElementById(`sel_${personaId}`).value;
    if (!val) tuttiCompilati = false;
    voti.push({ nomeVotato: persona.nome, cognomeVotato: persona.cognome, unita: val });
  });

  if (!tuttiCompilati) {
    alert("Per favore, assegna un'unità a tutti i capi prima di inviare.");
    btn.disabled = false;
    btn.innerText = "Invia il tuo Fanta-staff";
    return;
  }

  const payload = {
    voterNome: optScelta.dataset.nome,
    voterCognome: optScelta.dataset.cognome,
    voti: voti
  };

  try {
    await fetch(URL_APP_SCRIPT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" }, 
      body: JSON.stringify(payload)
    });
    avviaModalitaRisultati();
  } catch (err) {
    alert("Errore di connessione. Riprova.");
    btn.disabled = false;
    btn.innerText = "Invia il tuo Fanta-staff";
  }
}

// --- 4. GESTIONE RISULTATI IN TEMPO REALE ---
function preparaInterfacciaRisultati() {
  const contenitoreRisultati = document.getElementById("lista-risultati");
  
  coca.forEach(persona => {
    const personaId = getPersonaId(persona.nome, persona.cognome);
    
    const agesciBadge = persona.formAgesci && persona.formAgesci.trim() !== "" 
      ? `<span class="badge badge-agesci">${persona.formAgesci}</span>` : "";
    const aicBadge = persona.formAic && persona.formAic.trim() !== "" 
      ? `<span class="badge badge-aic">${persona.formAic}</span>` : "";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="info-persona">
        <div class="dettagli">
          <h3>${persona.nome} ${persona.cognome}</h3>
          <div class="badges-container">
            ${agesciBadge}
            ${aicBadge}
          </div>
        </div>
      </div>
      <div class="chart-container">
        <canvas id="chart_${personaId}"></canvas>
      </div>
      <div class="custom-legend" id="legend_${personaId}"></div>
      <div class="desiderio-container" id="desiderio_${personaId}">
        Desiderio personale: <em style="color:#94a3b8;">Nessun dato...</em>
      </div>
    `;
    contenitoreRisultati.appendChild(card);
    
    const ctx = document.getElementById(`chart_${personaId}`).getContext('2d');
    charts[personaId] = new Chart(ctx, {
      type: 'pie',
      data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { duration: 500 },
        layout: { padding: 5 }
      }
    });
  });
}

async function scaricaEAggiorna() {
  try {
    const res = await fetch(URL_APP_SCRIPT);
    const datiAggregati = await res.json(); 

    let gruppiUnita = {};
    unitaOptions.forEach(u => gruppiUnita[u] = []);
    let desideriRispettati = [];

    coca.forEach(persona => {
      const personaId = getPersonaId(persona.nome, persona.cognome);
      const datiPersona = datiAggregati[personaId];
      
      if (datiPersona && datiPersona.voti) {
        // --- 1. Aggiornamento Torte e Legende ---
        const labels = Object.keys(datiPersona.voti);
        const data = Object.values(datiPersona.voti);
        const colors = labels.map(l => coloriUnita[l] || "#000000");
        const totalVoti = data.reduce((sum, val) => sum + val, 0);

        charts[personaId].data.labels = labels;
        charts[personaId].data.datasets[0].data = data;
        charts[personaId].data.datasets[0].backgroundColor = colors;
        charts[personaId].update();

        let legendHtml = "";
        labels.forEach((label, index) => {
          const val = data[index];
          const perc = Math.round((val / totalVoti) * 100);
          legendHtml += `
            <div class="legend-item">
              <span class="legend-color" style="background-color: ${colors[index]}"></span>
              <span class="legend-label">${label}</span>
              <span class="legend-value">${perc}% (${val})</span>
            </div>
          `;
        });
        document.getElementById(`legend_${personaId}`).innerHTML = legendHtml;

        const contenitoreDesiderio = document.getElementById(`desiderio_${personaId}`);
        if (datiPersona.autoVoto) {
          const baseColor = coloriUnita[datiPersona.autoVoto] || "#64748b";
          const lightBg = baseColor + "33"; 
          contenitoreDesiderio.innerHTML = `Desiderio: <span class="badge-desiderio" style="background-color: ${lightBg}; border: 1px solid ${baseColor};">${datiPersona.autoVoto}</span>`;
        }

        // --- 2. Preparazione dati per la Vista Unità ---
        let maxVotes = 0;
        for (let u in datiPersona.voti) {
          if (datiPersona.voti[u] > maxVotes) maxVotes = datiPersona.voti[u];
        }
        
        let topUnits = [];
        for (let u in datiPersona.voti) {
          if (datiPersona.voti[u] === maxVotes) topUnits.push(u);
        }
        
        const isTie = topUnits.length > 1;

        // Creazione HTML dei badge per le micro-card
        const agesciBadge = persona.formAgesci && persona.formAgesci.trim() !== "" 
          ? `<span class="badge badge-agesci" style="font-size: 9px; padding: 2px 6px;">${persona.formAgesci}</span>` : "";
        const aicBadge = persona.formAic && persona.formAic.trim() !== "" 
          ? `<span class="badge badge-aic" style="font-size: 9px; padding: 2px 6px;">${persona.formAic}</span>` : "";
        const badgesHtml = `<div style="display:flex; gap:4px; margin-left: 8px;">${agesciBadge}${aicBadge}</div>`;

        topUnits.forEach(u => {
          if(gruppiUnita[u]) {
            gruppiUnita[u].push({ 
              nome: `${persona.nome} ${persona.cognome}`, 
              isTie: isTie,
              badges: (agesciBadge || aicBadge) ? badgesHtml : ""
            });
          }
        });

        if (datiPersona.autoVoto && topUnits.includes(datiPersona.autoVoto)) {
          desideriRispettati.push(`<strong>${persona.nome} ${persona.cognome}</strong> in ${datiPersona.autoVoto}`);
        }
      }
    });

    // --- 3. Rendering Griglia Unità ---
    let htmlUnita = "";
    unitaOptions.forEach(u => {
      const color = coloriUnita[u] || "#333";
      htmlUnita += `<div class="unita-card" style="border-top-color: ${color}">`;
      htmlUnita += `<div class="unita-title" style="color: ${color}">${u}</div>`;
      
      if(gruppiUnita[u].length === 0) {
        htmlUnita += `<div class="micro-card" style="color:#94a3b8; font-style:italic;">Nessun capo maggioritario</div>`;
      } else {
        gruppiUnita[u].forEach(p => {
          let tieBadge = p.isTie ? `<span class="tie-indicator">⚖️ Parità</span>` : '';
          htmlUnita += `
            <div class="micro-card">
              <div style="display: flex; align-items: center;">
                ${p.nome} ${p.badges}
              </div>
              ${tieBadge}
            </div>`;
        });
      }
      htmlUnita += `</div>`;
    });
    document.getElementById("griglia-unita").innerHTML = htmlUnita;

    // --- 4. Rendering Lista Desideri ---
    let htmlDesideri = desideriRispettati.length > 0
      ? desideriRispettati.map(d => `<li>${d}</li>`).join('')
      : `<li>Nessun desiderio coincidente con la maggioranza.</li>`;
    document.getElementById("lista-desideri").innerHTML = htmlDesideri;

  } catch (err) {
    console.error("Errore recupero aggiornamenti:", err);
  }
}
