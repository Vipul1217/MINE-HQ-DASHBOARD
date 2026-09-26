document.addEventListener('DOMContentLoaded', () => {
    // 1. BRUTEFORCE SESSION FIX: Stop ALL redirects by setting both keys
    const mockSession = { userName: 'Corporate Exec', title: 'Corporate Administrator', role: 'hq', org: 'Coal Corporation' };
    localStorage.setItem('activeSession', JSON.stringify(mockSession));
    localStorage.setItem('hqActiveSession', JSON.stringify(mockSession));
    const session = mockSession;

    // 2. Populate Identity
    const elName = document.getElementById('user-name');
    const elTitle = document.getElementById('user-title');
    const elOrg = document.getElementById('display-org');
    const elAvatar = document.getElementById('hq-avatar');

    if (elName) elName.innerText = session.userName;
    if (elTitle) elTitle.innerText = session.title;
    if (elOrg) elOrg.innerText = session.org;
    if (elAvatar) elAvatar.innerText = session.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // 3. Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('activeSession');
            localStorage.removeItem('hqActiveSession');
            window.location.href = '../index.html';
        });
    }

    // 4. Regulatory View Restrictions
    if (session.role === 'regulatory') {
        const restrictedElements = document.querySelectorAll('.restricted-nav, .restricted-panel');
        restrictedElements.forEach(el => el.style.display = 'none');
        const dashboardPanels = document.querySelector('.dashboard-panels');
        if (dashboardPanels) dashboardPanels.style.gridTemplateColumns = '1fr';
    }

    // 5. UNIFIED HQ SIDEBAR ROUTING FIX
    const sidebar = document.querySelector('.sidebar-nav');
    const currentPath = window.location.pathname;

    if (sidebar) {
        sidebar.innerHTML = `
            <div class="nav-section-title">STRATEGIC VIEW</div>
            <a href="dashboard.html" class="nav-item ${currentPath.includes('dashboard.html') ? 'active' : ''}">Corporate Overview</a>
            <a href="gis-map.html" class="nav-item ${currentPath.includes('gis-map.html') ? 'active' : ''}">Multi-Mine GIS Map</a>
            <a href="cross-mine.html" class="nav-item ${currentPath.includes('cross-mine.html') ? 'active' : ''}">Cross-Mine Analytics</a>

            <div class="nav-section-title">INTELLIGENCE & RISK</div>
            <a href="ai-risk.html" class="nav-item ${currentPath.includes('ai-risk.html') ? 'active' : ''}">AI Risk Center</a>
            <a href="escalation.html" class="nav-item ${currentPath.includes('escalation.html') ? 'active' : ''}">Escalation Monitor</a>

            <div class="nav-section-title">GOVERNANCE</div>
            <a href="compliance-gov.html" class="nav-item ${currentPath.includes('compliance-gov.html') ? 'active' : ''}">Compliance Dashboard</a>
            <a href="reports.html" class="nav-item ${currentPath.includes('reports.html') ? 'active' : ''}">Reports & Audit Trail</a>

            <div class="nav-section-title">EXTERNAL ACCESS</div>
            <a href="regulatory.html" class="nav-item ${currentPath.includes('regulatory.html') ? 'active' : ''}">Regulatory View</a>
        `;
    }
});

// 6. REAL LEAFLET GIS MAP LOGIC
window.addEventListener('load', () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes('gis-map.html')) {
        const mapElement = document.getElementById('hq-map-view');
        if (!mapElement) return;

        const map = L.map('hq-map-view').setView([23.75, 86.20], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        const hqMineDB = {
            "mine-a": { name: "Mine A (Jharia)", id: "MINE-ALPHA-01", output: "Prime Coking Coal", manager: "Rajesh Kumar", coords: [23.74, 86.41], riskLevel: "Low Risk", riskClass: "badge-success", markerClass: "map-dot-safe", score: "12/100", compliance: "96%", openIssues: 4, critical: 0 },
            "mine-b": { name: "Mine B (Dhanbad)", id: "MINE-BETA-02", output: "Thermal Coal", manager: "Vikram Sharma", coords: [23.79, 86.43], riskLevel: "High Risk", riskClass: "badge-critical", markerClass: "map-dot-critical", score: "82/100", compliance: "88%", openIssues: 12, critical: 3 },
            "mine-c": { name: "Mine C (Bokaro)", id: "MINE-GAMMA-03", output: "Metallurgical Coal", manager: "Anil Desai", coords: [23.78, 85.97], riskLevel: "Medium Risk", riskClass: "badge-warning", markerClass: "map-dot-warning", score: "45/100", compliance: "91%", openIssues: 7, critical: 1 }
        };

        const placeholder = document.getElementById('panel-placeholder');
        const contentPanel = document.getElementById('panel-content');
        const btnClose = document.getElementById('close-panel');
        const summaryContainer = document.getElementById('dynamic-mine-summary');

        Object.keys(hqMineDB).forEach(key => {
            const data = hqMineDB[key];
            const customIcon = L.divIcon({ className: 'custom-leaflet-marker', html: `<div class="${data.markerClass}"></div>`, iconSize: [24, 24] });
            const marker = L.marker(data.coords, { icon: customIcon }).addTo(map);
            marker.bindTooltip(data.name, { direction: 'top', offset: [0, -10], className: 'leaflet-custom-tooltip' });

            marker.on('click', () => {
                document.getElementById('detail-name').innerText = data.name;
                const statusBadge = document.getElementById('detail-status');
                statusBadge.innerText = data.riskLevel;
                statusBadge.className = `badge ${data.riskClass}`;
                document.getElementById('detail-risk-score').innerText = data.score;
                document.getElementById('detail-compliance').innerText = data.compliance;
                document.getElementById('detail-open').innerText = data.openIssues;
                document.getElementById('detail-critical').innerText = data.critical;

                if (summaryContainer) {
                    summaryContainer.innerHTML = `
                        <div style="margin-top: 12px; padding: 12px; background-color: rgba(255, 255, 255, 0.05); border-radius: 6px; border: 1px solid var(--border-medium); font-size: 12px; color: var(--text-muted); line-height: 1.6;">
                            <strong style="color: var(--text-primary); font-size: 13px;">Facility Profile: ${data.name}</strong><br>
                            <span style="color: var(--brand-brown); font-weight: 600;">ID: ${data.id}</span><br>
                            <strong>Primary Output:</strong> ${data.output}<br>
                            <strong>Current Shift Manager:</strong> ${data.manager}<br>
                            <strong>Compliance Status:</strong> Standard Operations (${data.compliance})<br>
                            <em style="display: block; margin-top: 6px; font-size: 11px; color: var(--warning-orange);">* Direct dashboard access requires internal intranet connection.</em>
                        </div>`;
                }
                placeholder.style.display = 'none';
                contentPanel.style.display = 'block';
                map.flyTo(data.coords, 11, { animate: true, duration: 1 });
            });
        });

        if (btnClose) {
            btnClose.addEventListener('click', () => {
                contentPanel.style.display = 'none';
                placeholder.style.display = 'flex';
                map.setView([23.75, 86.20], 10);
            });
        }
    }
});
// --- REPLACEMENT: AI RISK INTELLIGENCE INTERACTIVITY (CUSTOM NOTIFICATIONS) ---
window.addEventListener('load', () => {
    // Only run this logic on the AI Risk screen
    if (!window.location.pathname.includes('ai-risk.html')) return;

    // 0. Custom In-App Notification System (Toast)
    function showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.innerText = message;

        // Base styling for the notification card
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '14px 24px',
            borderRadius: '6px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            zIndex: '9999',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });

        // Color coding based on severity
        if (type === 'critical') toast.style.backgroundColor = 'var(--critical-red, #DC2626)';
        else if (type === 'warning') toast.style.backgroundColor = 'var(--warning-orange, #F59E0B)';
        else toast.style.backgroundColor = 'var(--success-green, #10B981)';

        document.body.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Slide out and remove after 3.5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // 1. "Enforce Immediate Audit" Button Logic (Mine B)
    const auditBtn = document.querySelector('.ai-risk-card .btn-action');
    if (auditBtn) {
        auditBtn.addEventListener('click', (e) => {
            e.target.innerText = 'Audit Initiated ✓';
            e.target.style.backgroundColor = '#10B981'; // Turn green
            e.target.style.pointerEvents = 'none'; // Disable double-clicking

            showNotification('CRITICAL ACTION: Immediate audit mandate dispatched to Mine B Manager.', 'critical');
        });
    }

    // 2. "Review Operations" Button Logic (Mine C)
    const reviewBtns = document.querySelectorAll('.ai-risk-card .btn-text');
    reviewBtns.forEach(btn => {
        if (btn.innerText.includes('Review')) {
            btn.addEventListener('click', () => {
                showNotification('ELEVATED RISK: Fetching historical highwall logs and maintenance records...', 'warning');
            });
        }
    });

    // 3. "Generate Preventive Work Order" Button Logic (Short-Term Forecast)
    const workOrderBtn = document.querySelector('.panel .btn-text');
    if (workOrderBtn && workOrderBtn.innerText.includes('Work Order')) {
        workOrderBtn.addEventListener('click', (e) => {
            e.target.innerText = 'Work Order Dispatched ✓';
            e.target.style.color = '#10B981';
            e.target.style.borderColor = '#10B981';
            e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
            e.target.style.pointerEvents = 'none';

            showNotification('PREDICTIVE ACTION: Work order #WO-992 generated for Mine B Ventilation System.', 'success');
        });
    }

    // 4. "Initiate Fleet-Wide Audit" Button Logic (If present)
    const fleetAuditBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Fleet-Wide Audit'));
    if (fleetAuditBtn) {
        fleetAuditBtn.addEventListener('click', (e) => {
            e.target.innerText = 'Fleet Audit Active ✓';
            e.target.style.backgroundColor = '#10B981';
            e.target.style.color = '#FFFFFF';
            e.target.style.pointerEvents = 'none';

            showNotification('SYSTEMIC PATTERN: Procurement freeze on Model X-700 initiated. Fleet audit dispatched.', 'critical');
        });
    }
});
// --- CORPORATE OVERVIEW INTERACTIVITY (dashboard.html) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. AI Intelligence Routing
    const btnViewAI = document.getElementById('btn-view-ai');
    if (btnViewAI) {
        btnViewAI.addEventListener('click', () => {
            window.location.href = 'cross-mine.html'; // Routes to the Cross-Mine Analytics page
        });
    }

    // 2. Mine Drill-Down Simulation
    const mineLinks = document.querySelectorAll('.mine-link');
    mineLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetMine = e.target.getAttribute('data-target');

            // Optional: Create a temporary toast if you have the function, otherwise standard alert
            alert(`Initiating secure tunnel to operational dashboard for ${targetMine}...`);

            // Route down to the local Mine Manager dashboard
            window.location.href = '../mine-dashboard/dashboard.html';
        });
    });

    // 3. Secure Logout
    const btnHqLogout = document.getElementById('btn-hq-logout');
    if (btnHqLogout) {
        btnHqLogout.addEventListener('click', () => {
            localStorage.removeItem('hqActiveSession');
            window.location.href = 'index.html'; // Routes back to HQ Login
        });
    }
});