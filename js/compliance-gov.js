// --- DEDICATED HQ COMPLIANCE GOVERNANCE MODULE ---
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('compliance-gov.html')) return;

    // --- Custom In-App Notification System (Toast) ---
    function showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.innerText = message;

        Object.assign(toast.style, {
            position: 'fixed', bottom: '24px', right: '24px', padding: '14px 24px',
            borderRadius: '6px', color: '#FFFFFF', fontSize: '13px', fontWeight: '600',
            zIndex: '9999', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', opacity: '0',
            transform: 'translateY(20px)', transition: 'opacity 0.3s ease, transform 0.3s ease'
        });

        if (type === 'critical') toast.style.backgroundColor = '#DC2626'; // var(--critical-red)
        else if (type === 'warning') toast.style.backgroundColor = '#F59E0B'; // var(--warning-orange)
        else toast.style.backgroundColor = '#10B981'; // var(--success-green)

        document.body.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Slide out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // 1. Regulation Tracking Database
    const regDB = [
        { req: "Ventilation Inspection", source: "CMR 2017 (Reg 143)", total: 24, compliant: 22, pending: 2, violation: 0 },
        { req: "Highwall Stability Audit", source: "DGMS Tech Circ 04", total: 18, compliant: 15, pending: 2, violation: 1 },
        { req: "Effluent Discharge Monitor", source: "EPA Statutory", total: 24, compliant: 24, pending: 0, violation: 0 },
        { req: "Contractor PPE Audit", source: "CMR Reg 182", total: 24, compliant: 19, pending: 3, violation: 2 },
        { req: "Dust Suppression Check", source: "Mines Act Sec 22", total: 24, compliant: 21, pending: 1, violation: 2 }
    ];

    const tbody = document.getElementById('gov-reg-tbody');
    if (tbody) {
        let html = "";
        regDB.forEach(reg => {
            const vClass = reg.violation > 0 ? 'color: var(--critical-red); font-weight: 700;' : 'color: var(--text-muted);';
            const pClass = reg.pending > 0 ? 'color: var(--warning-orange); font-weight: 600;' : 'color: var(--text-muted);';

            html += `
                <tr>
                    <td style="font-weight: 600; color: var(--text-primary);">${reg.req}</td>
                    <td style="font-size: 12px; color: var(--text-secondary);">${reg.source}</td>
                    <td style="font-weight: 600;">${reg.total}</td>
                    <td style="color: var(--success-green); font-weight: 600;">${reg.compliant}</td>
                    <td style="${pClass}">${reg.pending}</td>
                    <td style="${vClass}">${reg.violation}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    // 2. Compliance Heatmap Rendering
    const mineHeatmapDB = [
        { name: "Mine A", score: "98%", status: "status-strong" },
        { name: "Mine B", score: "62%", status: "status-critical" },
        { name: "Mine C", score: "81%", status: "status-pending" },
        { name: "Mine D", score: "94%", status: "status-strong" },
        { name: "Mine E", score: "91%", status: "status-strong" },
        { name: "Mine F", score: "86%", status: "status-pending" },
        { name: "Mine G", score: "74%", status: "status-critical" },
        { name: "Mine H", score: "99%", status: "status-strong" },
        { name: "Mine I", score: "95%", status: "status-strong" }
    ];

    const heatmapGrid = document.getElementById('heatmap-grid');
    if (heatmapGrid) {
        let hMapHtml = "";
        mineHeatmapDB.forEach(mine => {
            hMapHtml += `
                <div class="heatmap-node ${mine.status}" data-mine="${mine.name}" data-score="${mine.score}">
                    <div class="node-title">${mine.name}</div>
                    <div class="node-score">${mine.score}</div>
                </div>
            `;
        });
        heatmapGrid.innerHTML = hMapHtml;

        // Interactive Heatmap Clicks (Toast Notification)
        document.querySelectorAll('.heatmap-node').forEach(node => {
            node.addEventListener('click', (e) => {
                const mineName = e.currentTarget.getAttribute('data-mine');
                const mineScore = e.currentTarget.getAttribute('data-score');

                let notifType = 'success';
                if (e.currentTarget.classList.contains('status-critical')) notifType = 'critical';
                if (e.currentTarget.classList.contains('status-pending')) notifType = 'warning';

                showNotification(`Fetching detailed statutory audit logs for ${mineName} (Current Score: ${mineScore}).`, notifType);
            });
        });
    }

    // 3. Generate Audit Report Interaction
    const generateBtn = document.querySelector('.panel-header .btn-action');
    if (generateBtn && generateBtn.innerText.includes('Generate Audit Report')) {
        generateBtn.addEventListener('click', (e) => {
            // State Change
            e.target.innerText = 'Report Generated ✓';
            e.target.style.backgroundColor = '#10B981'; // Turn green
            e.target.style.color = '#FFFFFF';
            e.target.style.pointerEvents = 'none';

            // Trigger HQ Notification
            showNotification('National Statutory Compliance Report compiled and saved to Corporate Vault.', 'success');
        });
    }
});