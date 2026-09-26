// --- DEDICATED HQ REPORTS & AUDIT MODULE ---
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('reports.html')) return;

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

    // 1. Immutable Audit Trail Data
    const auditDB = [
        { time: "15:00", type: "success", title: "Issue Verified & Closed", desc: "Mine B Manager verified uploaded evidence for TSK-801. State changed to RESOLVED." },
        { time: "14:00", type: "default", title: "Evidence Uploaded", desc: "Maintenance Officer attached 'repair_log_v12.pdf' and photographs to TSK-801." },
        { time: "10:40", type: "default", title: "Task Assigned", desc: "Corrective Task TSK-801 created and assigned to Maintenance Team by Mine B Manager." },
        { time: "10:35", type: "ai", title: "AI Risk Calculated", desc: "Neural Engine classified INC-1045 as Critical (92/100). Recurrence pattern isolated." },
        { time: "10:30", type: "critical", title: "Incident Reported", desc: "Ventilation Fan V-12 failure detected via automated sensor in Sector B-4." }
    ];

    const timelineContainer = document.getElementById('audit-timeline');
    if (timelineContainer) {
        let timelineHTML = "";
        auditDB.forEach(event => {
            timelineHTML += `
                <div class="timeline-item ${event.type}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-time">${event.time}</div>
                    <div class="timeline-content">
                        <strong>${event.title}</strong>
                        <span>${event.desc}</span>
                    </div>
                </div>
            `;
        });
        timelineContainer.innerHTML = timelineHTML;
    }

    // 2. Report Generation Interactivity
    const generateBtns = document.querySelectorAll('.btn-generate');
    generateBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const reportType = e.target.getAttribute('data-type');

            // Visual state change
            e.target.innerText = 'Compiling Data...';
            e.target.style.backgroundColor = '#F59E0B'; // Warning orange temporarily
            e.target.style.color = '#FFFFFF';
            e.target.style.pointerEvents = 'none';

            // Simulate processing time
            setTimeout(() => {
                e.target.innerText = 'Download Report PDF ↓';
                e.target.style.backgroundColor = '#10B981'; // Turn green

                showNotification(`${reportType} Report successfully generated and logged in Corporate Vault.`, 'success');

                // Allow downloading again after a moment
                setTimeout(() => {
                    e.target.style.pointerEvents = 'auto';
                }, 1000);
            }, 1200);
        });
    });
});