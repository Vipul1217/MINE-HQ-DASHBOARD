// --- DEDICATED REGULATORY VIEW MODULE ---
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('regulatory.html')) return;

    // Custom Toast Notification System
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

    // 1. Populate Read-Only Incident Records (Bug Fixed)
    const incDB = [
        { id: "INC-1045", mine: "Mine B (Jharia)", sev: "Critical", sevClass: "badge-critical", status: "Open", statClass: "badge-warning" },
        { id: "INC-1044", mine: "Mine C", sev: "Warning", sevClass: "badge-warning", status: "Assigned", statClass: "badge-normal" },
        { id: "INC-1041", mine: "Mine A", sev: "Normal", sevClass: "badge-normal", status: "Resolved", statClass: "badge-success" }
    ];

    const incTbody = document.getElementById('reg-incidents-tbody');
    if (incTbody) {
        let html = "";
        incDB.forEach(i => {
            html += `
                <tr>
                    <td style="font-weight: 700; color: var(--brand-brown);">${i.id}</td>
                    <td>${i.mine}</td>
                    <td><span class="badge ${i.sevClass}">${i.sev}</span></td>
                    <td><span class="badge ${i.statClass}">${i.status}</span></td>
                </tr>
            `;
        });
        incTbody.innerHTML = html;
    }

    // 2. Populate Read-Only Audit Trail
    const auditDB = [
        { time: "Today, 15:00", action: "Evidence Verified (TSK-801)", person: "Mine B Manager (Rajesh K.)", log: "Digital signature validated. State changed to RESOLVED." },
        { time: "Today, 14:00", action: "Evidence Uploaded (TSK-801)", person: "Maintenance Officer", log: "File 'repair_log.pdf' securely hashed and stored." },
        { time: "Today, 10:40", action: "Task Assigned (TSK-801)", person: "Mine B Manager", log: "Delegated to field team following AI Risk Flag." },
        { time: "Yesterday", action: "Statutory Obligation CMP-04 Flagged", person: "System Auto-Audit", log: "Contractor PPE violation identified via CCTV." }
    ];

    const auditTbody = document.getElementById('reg-audit-tbody');
    if (auditTbody) {
        let html = "";
        auditDB.forEach(a => {
            html += `
                <tr>
                    <td style="font-weight: 600; font-size: 12px; color: var(--text-muted);">${a.time}</td>
                    <td style="font-weight: 600; color: var(--text-primary);">${a.action}</td>
                    <td>${a.person}</td>
                    <td style="font-size: 12px; color: var(--text-secondary);">${a.log}</td>
                </tr>
            `;
        });
        auditTbody.innerHTML = html;
    }

    // 3. View Reports Interactivity (PDF Buttons)
    const reportBtns = document.querySelectorAll('.btn-text');
    reportBtns.forEach(btn => {
        if (btn.innerText.includes('View PDF')) {
            btn.addEventListener('click', (e) => {
                const originalText = e.target.innerText;

                // Simulate decryption/loading
                e.target.innerText = 'Decrypting...';
                e.target.style.pointerEvents = 'none';
                e.target.style.color = '#F59E0B'; // Turn orange during load

                setTimeout(() => {
                    e.target.innerText = 'Document Opened ✓';
                    e.target.style.color = '#10B981'; // Turn green on success

                    showNotification('Secure regulatory document decrypted and launched in external viewer.', 'success');

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        e.target.innerText = originalText;
                        e.target.style.pointerEvents = 'auto';
                        e.target.style.color = '';
                    }, 3000);
                }, 800);
            });
        }
    });

    // 4. Exit Audit View Routing
    const exitBtn = document.getElementById('logout-btn');
    if (exitBtn) {
        exitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Closing secure regulatory session. Redirecting to login...', 'warning');

            // Redirect after showing the toast
            setTimeout(() => {
                window.location.href = '../index.html'; // Adjust this path if your login is elsewhere
            }, 1500);
        });
    }
});