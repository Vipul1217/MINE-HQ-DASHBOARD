// --- DEDICATED ESCALATION MONITORING MODULE ---
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('escalation.html')) return;

    // Toast Notification System
    function showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.innerText = message;
        Object.assign(toast.style, {
            position: 'fixed', bottom: '24px', right: '24px', padding: '14px 24px',
            borderRadius: '6px', color: '#FFFFFF', fontSize: '13px', fontWeight: '600',
            zIndex: '9999', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', opacity: '0',
            transform: 'translateY(20px)', transition: 'all 0.3s ease'
        });
        toast.style.backgroundColor = type === 'critical' ? '#DC2626' : (type === 'warning' ? '#F59E0B' : '#10B981');
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    const escDB = [
        { id: "ESC-01", mine: "Mine B", issue: "Hydraulic Equipment Failure (Model X-700)", dept: "Maintenance", delay: "48 Hours", status: "Critical", level: "Level 2", activeStep: 2 },
        { id: "ESC-02", mine: "Mine C", issue: "Highwall Radar Calibration Overdue", dept: "Safety", delay: "72 Hours", status: "Overdue", level: "Level 3", activeStep: 3 },
        { id: "ESC-03", mine: "Mine A", issue: "Pending Q3 Effluent Sign-off", dept: "Compliance", delay: "12 Hours", status: "Pending", level: "Level 1", activeStep: 1 },
        { id: "ESC-04", mine: "Mine B", issue: "Ventilation Fan V-12 Warning", dept: "Maintenance", delay: "24 Hours", status: "Critical", level: "Level 2", activeStep: 2 }
    ];

    const tbody = document.getElementById('escalation-tbody');

    function renderEscalations(filterType = "All", filterMine = "All", filterDept = "All") {
        if (!tbody) return;

        let filtered = escDB.filter(e => {
            let matchType = filterType === "All" || e.status === filterType;
            let matchMine = filterMine === "All" || e.mine === filterMine;
            let matchDept = filterDept === "All" || e.dept === filterDept;
            return matchType && matchMine && matchDept;
        });

        let html = "";
        filtered.forEach(e => {
            // Build the visual flow tracker
            const s1 = e.activeStep >= 1 ? 'active' : '';
            const s2 = e.activeStep >= 2 ? 'active' : '';
            const s3 = e.activeStep >= 3 ? 'active' : '';

            const flowUI = `
                <div class="flow-tracker">
                    <div class="flow-step ${s1}">Officer</div>
                    <div class="flow-arrow">→</div>
                    <div class="flow-step ${s2}">Manager</div>
                    <div class="flow-arrow">→</div>
                    <div class="flow-step ${s3}">HQ (Corp)</div>
                </div>
            `;

            let badgeClass = e.level === "Level 3" ? "badge-critical" : (e.level === "Level 2" ? "badge-warning" : "badge-normal");
            let delayColor = parseInt(e.delay) > 24 ? "color: var(--critical-red); font-weight:700;" : "color: var(--warning-orange); font-weight:600;";

            html += `
                <tr>
                    <td style="font-weight: 700; color: var(--brand-brown);">${e.mine}</td>
                    <td style="font-weight: 600; color: var(--text-primary);">${e.issue}</td>
                    <td>${e.dept}</td>
                    <td style="${delayColor}">${e.delay}</td>
                    <td>${flowUI}</td>
                    <td><span class="badge ${badgeClass}">${e.level}</span></td>
                    <td>
                        <button class="btn-action btn-intervene" style="background-color: var(--critical-red); color: white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;" data-id="${e.id}">Intervene</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;

        // Bind intervene buttons
        document.querySelectorAll('.btn-intervene').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                const id = ev.target.getAttribute('data-id');
                ev.target.innerText = "Intervention Active";
                ev.target.style.backgroundColor = "#10B981";
                ev.target.style.pointerEvents = "none";
                showNotification(`CORPORATE INTERVENTION: HQ Override initiated for ${id}. Direct channel opened with Facility Manager.`, 'critical');
            });
        });
    }

    // Initial Render
    renderEscalations();

    // Bind Button Filters
    const filterBtns = document.querySelectorAll('#esc-filter-group .btn-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(f => f.classList.remove('active'));
            e.target.classList.add('active');
            triggerFilters();
        });
    });

    // Bind Dropdown Filters
    document.getElementById('filter-mine')?.addEventListener('change', triggerFilters);
    document.getElementById('filter-dept')?.addEventListener('change', triggerFilters);

    function triggerFilters() {
        const type = document.querySelector('#esc-filter-group .btn-filter.active').getAttribute('data-filter');
        const mine = document.getElementById('filter-mine').value;
        const dept = document.getElementById('filter-dept').value;
        renderEscalations(type, mine, dept);
    }
});