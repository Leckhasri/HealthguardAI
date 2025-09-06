// user.js
document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const userData = {
        email: 'john.doe@email.com',
        familyMembers: [
            {
                id: 1,
                name: 'John Doe',
                patientId: 'PT001',
                age: 45,
                phone: '+1-555-0123',
                relationship: 'Self',
                insuranceId: 'INS12345',
                medicalHistory: 'Diabetes, Hypertension',
                emergencyContact: 'Jane Doe - +1-555-0124'
            },
            {
                id: 2,
                name: 'Jane Doe',
                patientId: 'PT002',
                age: 42,
                phone: '+1-555-0124',
                relationship: 'Spouse',
                insuranceId: 'INS12346',
                medicalHistory: 'No significant history',
                emergencyContact: 'John Doe - +1-555-0123'
            }
        ],
        claims: [
            {
                id: 'CLM001',
                memberId: 1,
                memberName: 'John Doe',
                type: 'inpatient',
                amount: 15000,
                status: 'approved',
                dateSubmitted: '2024-01-15',
                fraudRisk: 'LOW',
                fraudProb: 0.0234
            }
        ]
    };

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('theme-icon');

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        
        if (theme === 'light') {
            themeIcon.src = 'static/assets/images/sun.png';
            themeIcon.alt = 'Switch to Dark Mode';
        } else {
            themeIcon.src = 'static/assets/images/brightness.png';
            themeIcon.alt = 'Switch to Light Mode';
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const panel = document.getElementById(tabName + '-section');
            if (panel) panel.classList.add('active');
        });
    });

    // Logout functionality - FIXED: Changed from 'logout-Btn' to 'logoutBtn'
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
  window.location.href = "/login";
});


    // Load Family Members
    function loadFamilyMembers() {
        const container = document.getElementById('membersContainer');
        if (!container) return;

        container.innerHTML = '';
        
        userData.familyMembers.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';
            memberCard.innerHTML = `
                <div class="member-header">
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p>${member.relationship} • Patient ID: ${member.patientId}</p>
                    </div>
                    <span class="expand-icon">▼</span>
                </div>
                <div class="member-details">
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Age</div>
                            <div class="detail-value">${member.age} years</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Phone</div>
                            <div class="detail-value">${member.phone}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Insurance ID</div>
                            <div class="detail-value">${member.insuranceId}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Medical History</div>
                            <div class="detail-value">${member.medicalHistory}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Emergency Contact</div>
                            <div class="detail-value">${member.emergencyContact}</div>
                        </div>
                    </div>
                </div>
            `;

            // Add click handler for expansion
            const header = memberCard.querySelector('.member-header');
            header.addEventListener('click', () => {
                memberCard.classList.toggle('expanded');
                const icon = memberCard.querySelector('.expand-icon');
                icon.textContent = memberCard.classList.contains('expanded') ? '▲' : '▼';
            });

            container.appendChild(memberCard);
        });
    }

    // Load Claims
    function loadClaims() {
        const container = document.getElementById('claimsContainer');
        if (!container) return;

        container.innerHTML = '';
        
        userData.claims.forEach(claim => {
            const claimCard = document.createElement('div');
            claimCard.className = 'claim-card';
            claimCard.innerHTML = `
                <div class="claim-header">
                    <div class="claim-info">
                        <h4>${claim.memberName}</h4>
                        <div class="claim-id">Claim ID: ${claim.id}</div>
                    </div>
                    <div class="claim-status status-${claim.status}">${claim.status}</div>
                </div>
                <div class="claim-details">
                    <p><strong>Type:</strong> ${claim.type}</p>
                    <p><strong>Amount:</strong> $${claim.amount.toLocaleString()}</p>
                    <p><strong>Date Submitted:</strong> ${claim.dateSubmitted}</p>
                    <p><strong>Fraud Risk:</strong> ${claim.fraudRisk} (${(claim.fraudProb * 100).toFixed(2)}%)</p>
                </div>
            `;
            container.appendChild(claimCard);
        });
    }

    // Filter Claims
    function filterClaims() {
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');
        
        if (!statusFilter || !typeFilter) return;

        statusFilter.addEventListener('change', applyFilters);
        typeFilter.addEventListener('change', applyFilters);

        function applyFilters() {
            const statusValue = statusFilter.value;
            const typeValue = typeFilter.value;
            
            const filteredClaims = userData.claims.filter(claim => {
                const statusMatch = !statusValue || claim.status === statusValue;
                const typeMatch = !typeValue || claim.type === typeValue;
                return statusMatch && typeMatch;
            });

            const container = document.getElementById('claimsContainer');
            container.innerHTML = '';
            
            filteredClaims.forEach(claim => {
                const claimCard = document.createElement('div');
                claimCard.className = 'claim-card';
                claimCard.innerHTML = `
                    <div class="claim-header">
                        <div class="claim-info">
                            <h4>${claim.memberName}</h4>
                            <div class="claim-id">Claim ID: ${claim.id}</div>
                        </div>
                        <div class="claim-status status-${claim.status}">${claim.status}</div>
                    </div>
                    <div class="claim-details">
                        <p><strong>Type:</strong> ${claim.type}</p>
                        <p><strong>Amount:</strong> $${claim.amount.toLocaleString()}</p>
                        <p><strong>Date Submitted:</strong> ${claim.dateSubmitted}</p>
                        <p><strong>Fraud Risk:</strong> ${claim.fraudRisk} (${(claim.fraudProb * 100).toFixed(2)}%)</p>
                    </div>
                `;
                container.appendChild(claimCard);
            });
        }
    }

    // Initialize
    loadFamilyMembers();
    loadClaims();
    filterClaims();
});

// provider.js — connect to Flask APIs

// document.addEventListener("DOMContentLoaded", () => {
//   wireTheme();
//   wireTabs();
//   wireLogout();
//   boot();
// });

// /* ---------- Boot ---------- */
// async function boot() {
//   try {
//     // 1) Provider identity
//     const p = await getJSON("/provider_data");
//     if (p.status !== "success") return toast(p.message || "Auth required", "error");

//     const info = p.data || {};
//     fillProvider(info);

//     // 2) Patients of this provider
//     const patients = await getJSON("/provider_patients");
//     if (patients.status === "success") renderPatients(patients.data || []);
//     else renderPatients([]);

//     // 3) Claims of this provider
//     const claims = await getJSON("/provider_claims");
//     if (claims.status === "success") {
//       window.__allClaims = claims.data || [];
//       renderClaims(window.__allClaims);
//       wireClaimFilters();
//     } else {
//       renderClaims([]);
//     }
//   } catch (e) {
//     console.error(e);
//     toast("Server error. Please try again.", "error");
//   }
// }

// /* ---------- API helper ---------- */
// async function getJSON(url, options = {}) {
//   const res = await fetch(url, { credentials: "same-origin", ...options });
//   return res.json();
// }

// /* ---------- Theme ---------- */
// function wireTheme() {
//   const btn = document.getElementById("themeToggle");
//   const icon = document.getElementById("theme-icon");

//   function setIcon(theme) {
//     if (!icon) return;
//     icon.src = theme === "light"
//       ? "/static/assets/images/sun.png"
//       : "/static/assets/images/brightness.png";
//   }

//   const saved = localStorage.getItem("theme") || "light";
//   document.documentElement.setAttribute("data-theme", saved);
//   setIcon(saved);

//   btn?.addEventListener("click", () => {
//     const cur = document.documentElement.getAttribute("data-theme");
//     const next = cur === "light" ? "dark" : "light";
//     document.documentElement.setAttribute("data-theme", next);
//     localStorage.setItem("theme", next);
//     setIcon(next);
//   });
// }

// /* ---------- Tabs ---------- */
// function wireTabs() {
//   const buttons = document.querySelectorAll(".tab-btn");
//   const panels = document.querySelectorAll(".tab-content");
//   buttons.forEach(b => {
//     b.addEventListener("click", () => {
//       const tab = b.getAttribute("data-tab");
//       buttons.forEach(x => x.classList.remove("active"));
//       panels.forEach(p => p.classList.remove("active"));
//       b.classList.add("active");
//       document.getElementById(`${tab}-section`)?.classList.add("active");
//     });
//   });
// }

// /* ---------- Logout ---------- */
// function wireLogout() {
//   document.getElementById("logoutBtn")?.addEventListener("click", () => {
//     window.location.href = "/logout";
//   });
// }

// /* ---------- Fill provider header/sidebar ---------- */
// function fillProvider(p) {
//   const name = p.provider_name || "Provider";
//   const email = p.email || "";
//   const id = p.provider_id || "—";
//   setText("provName", name);
//   setText("provEmail", email);
//   setText("navProvName", name);
//   const initials = name.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase();
//   setText("provAvatar", initials);
// }

// /* ---------- Patients list ---------- */
// function renderPatients(list) {
//   const box = document.getElementById("membersContainer");
//   box.innerHTML = "";
//   if (!list.length) {
//     box.innerHTML = `<div class="member-card"><div class="member-header"><div class="member-info"><h3>No patients found</h3></div></div></div>`;
//     return;
//   }

//   list.forEach(m => {
//     const card = document.createElement("div");
//     card.className = "member-card";
//     card.innerHTML = `
//       <div class="member-header">
//         <div class="member-info">
//           <h3>${escapeHTML(m.name || m.patient_id)}</h3>
//           <p>Patient ID: ${escapeHTML(m.patient_id)}</p>
//         </div>
//         <span class="dropdown-icon">▼</span>
//       </div>
//       <div class="member-details">
//         <div class="details-grid">
//           <div class="detail-item"><div class="detail-label">Age</div><div class="detail-value">${safe(m.age)} </div></div>
//           <div class="detail-item"><div class="detail-label">Phone</div><div class="detail-value">${safe(m.phone)}</div></div>
//           <div class="detail-item"><div class="detail-label">Insurance ID</div><div class="detail-value">${safe(m.insurance_id)}</div></div>
//           <div class="detail-item"><div class="detail-label">Address</div><div class="detail-value">${safe(m.address)}</div></div>
//         </div>
//       </div>
//     `;
//     card.querySelector(".member-header").addEventListener("click", () => {
//       card.classList.toggle("expanded");
//     });
//     box.appendChild(card);
//   });
// }

// /* ---------- Claims list + filters ---------- */
// function wireClaimFilters() {
//   const statusSel = document.getElementById("statusFilter");
//   const typeSel = document.getElementById("typeFilter");
//   const apply = () => {
//     const s = statusSel.value;
//     const t = typeSel.value;
//     let rows = [...(window.__allClaims || [])];
//     if (s) rows = rows.filter(r => (r.status || "").toLowerCase() === s.toLowerCase());
//     if (t) rows = rows.filter(r => (r.type || "").toLowerCase() === t.toLowerCase());
//     renderClaims(rows);
//   };
//   statusSel?.addEventListener("change", apply);
//   typeSel?.addEventListener("change", apply);
// }

// function renderClaims(list) {
//   const box = document.getElementById("claimsContainer");
//   box.innerHTML = "";
//   if (!list.length) {
//     box.innerHTML = `<div class="claim-card"><div class="claim-header"><div class="claim-info"><h4>No claims found</h4></div></div></div>`;
//     return;
//   }

//   list.forEach(c => {
//     const pillClass = pillFromStatus(c.status);
//     const amount = numToCurrency(c.amount);
//     const prob = isFinite(c.fraud_prob) ? ` (${(c.fraud_prob*100).toFixed(2)}%)` : "";
//     const name = c.patient_name || c.patient_id || "Patient";
//     const id = c.id || c.claim_id;

//     const card = document.createElement("div");
//     card.className = "claim-card";
//     card.innerHTML = `
//       <div class="claim-header">
//         <div class="claim-info">
//           <h4>${escapeHTML(name)}</h4>
//           <div class="claim-id">Claim ID: ${escapeHTML(id)}</div>
//         </div>
//         <div class="claim-status ${pillClass}">${escapeHTML(c.status || "—")}</div>
//       </div>
//       <div class="claim-details">
//         <p><strong>Type:</strong> ${escapeHTML(c.type || "—")}</p>
//         <p><strong>Amount:</strong> ${amount}</p>
//         <p><strong>Date Submitted:</strong> ${escapeHTML(c.date_submitted || "—")}</p>
//         <p><strong>Fraud Risk:</strong> ${escapeHTML(c.fraud_risk || "—")}${prob}</p>
//       </div>
//     `;
//     box.appendChild(card);
//   });
// }

// /* ---------- Small helpers ---------- */
// function pillFromStatus(s){
//   const v = String(s||"").toLowerCase();
//   if (v.includes("approve")) return "status-approved";
//   if (v.includes("reject") || v.includes("deny")) return "status-rejected";
//   if (v.includes("process")) return "status-processing";
//   return "status-pending";
// }
// function numToCurrency(v){
//   const n = Number(v);
//   return Number.isFinite(n) ? n.toLocaleString(undefined,{style:"currency",currency:"USD"}) : (v??"-");
// }
// function safe(v){ return v==null || v==="" ? "—" : String(v) }
// function escapeHTML(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])) }
// function setText(id, val){ const el = document.getElementById(id); if(el) el.textContent = val; }

// /* tiny toast */
// function toast(msg,type="info"){
//   let box = document.getElementById("pv-toast");
//   if(!box){ box = document.createElement("div"); box.id="pv-toast";
//     Object.assign(box.style,{position:"fixed",top:"18px",right:"18px",zIndex:9999,display:"flex",flexDirection:"column",gap:"8px"});
//     document.body.appendChild(box);
//   }
//   const t = document.createElement("div"); t.textContent = msg;
//   const err = type==="error";
//   Object.assign(t.style,{
//     background: err?"#fee2e2":"#eef6ff",
//     color: err?"#991b1b":"#0b5394",
//     border: `1px solid ${err?"#fecaca":"#cfeaff"}`,
//     borderRadius:"10px", padding:"10px 12px", fontWeight:700,
//     boxShadow:"0 10px 30px rgba(2,132,199,.08)"
//   });
//   box.appendChild(t); setTimeout(()=>t.remove(), 3000);
// }
