document.addEventListener('DOMContentLoaded', () => {
    // Master Directory for Credentials
    const HQ_DIRECTORY = {
        'HQ_MANAGER_01': {
            password: 'admin',
            role: 'hq',
            userName: 'Corporate Exec',
            title: 'Corporate Administrator',
            org: 'Coal Corporation'
        },
        'DGMS_AUDIT_01': {
            password: 'audit',
            role: 'regulatory',
            userName: 'Regulatory Inspector',
            title: 'DGMS Auditor',
            org: 'DGMS'
        },
        'MOC_ADMIN_01': {
            password: 'gov',
            role: 'regulatory',
            userName: 'Gov. Secretary',
            title: 'Ministry Oversight',
            org: 'Ministry of Coal'
        }
    };

    const loginForm = document.getElementById('hq-login-form');
    const errorBox = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const org = document.getElementById('org').value;
            const role = document.getElementById('role').value;
            const username = document.getElementById('username').value.trim().toUpperCase();
            const password = document.getElementById('password').value.trim();

            const record = HQ_DIRECTORY[username];

            // 1. Validate Credentials
            if (record && record.password === password && record.org === org && record.role === role) {
                errorBox.style.display = 'none';

                // 2. Set Secure Session Data
                const sessionData = {
                    role: record.role,
                    userName: record.userName,
                    title: record.title,
                    org: record.org,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('hqActiveSession', JSON.stringify(sessionData));

                // 3. Role-Based Routing
                // 3. Role-Based Routing
                if (record.role === 'regulatory') {
                    if (record.org === 'Ministry of Coal') {
                        // Route Ministry to their dedicated strategic portal
                        window.location.href = 'ministry.html';
                    } else {
                        // Route DGMS to the standard read-only audit view
                        window.location.href = 'regulatory.html';
                    }
                } else if (record.role === 'hq') {
                    window.location.href = 'dashboard.html';
                }
            } else {
                // 4. Handle Failure
                errorBox.innerText = 'Authentication Failed: Credentials or Access Level mismatch.';
                errorBox.style.display = 'block';
                document.getElementById('password').value = '';
            }
        });
    }
});