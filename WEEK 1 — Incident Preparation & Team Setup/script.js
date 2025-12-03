// ===== DOM Elements =====
const taskCheckboxes = document.querySelectorAll('.task-checkbox');
const progressFill = document.querySelector('.progress-fill');
const progressPercent = document.querySelector('.progress-percent');
const tasksCompleted = document.getElementById('tasks-completed');
const deliverablesCount = document.getElementById('deliverables-count');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    loadProgress();
    initCheckboxListeners();
});

// ===== Set Current Date =====
function setCurrentDate() {
    const dateElement = document.getElementById('current-date');
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);
}

// ===== Progress Management =====
function loadProgress() {
    const savedProgress = localStorage.getItem('week1Progress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        progress.forEach((checked, index) => {
            if (taskCheckboxes[index]) {
                taskCheckboxes[index].checked = checked;
                if (checked) {
                    taskCheckboxes[index].closest('.task-card').classList.add('completed');
                }
            }
        });
    }
    updateProgress();
}

function saveProgress() {
    const progress = Array.from(taskCheckboxes).map(cb => cb.checked);
    localStorage.setItem('week1Progress', JSON.stringify(progress));
}

function updateProgress() {
    const total = taskCheckboxes.length;
    const completed = Array.from(taskCheckboxes).filter(cb => cb.checked).length;
    const percent = Math.round((completed / total) * 100);

    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
    tasksCompleted.textContent = completed;

    // Update deliverables count based on task completion
    const deliverables = completed >= 2 ? Math.min(Math.floor(completed / 1.5), 2) : 0;
    deliverablesCount.textContent = `${deliverables}/2`;

    // Update deliverable statuses
    updateDeliverableStatuses(completed);
}

function updateDeliverableStatuses(completedTasks) {
    const deliverableStatuses = document.querySelectorAll('.deliverable-status');
    deliverableStatuses.forEach((status, index) => {
        if (index === 0 && completedTasks >= 2) {
            status.classList.remove('pending');
            status.classList.add('complete');
            status.innerHTML = '<i class="fas fa-check-circle"></i><span>Ready</span>';
        } else if (index === 1 && completedTasks >= 3) {
            status.classList.remove('pending');
            status.classList.add('complete');
            status.innerHTML = '<i class="fas fa-check-circle"></i><span>Ready</span>';
        }
    });
}

function initCheckboxListeners() {
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskCard = e.target.closest('.task-card');
            if (e.target.checked) {
                taskCard.classList.add('completed');
                showNotification('Task completed! 🎉');
            } else {
                taskCard.classList.remove('completed');
            }
            saveProgress();
            updateProgress();
        });
    });
}

// ===== Modal Functions =====
function toggleRolesModal() {
    const modal = document.getElementById('rolesModal');
    modal.classList.toggle('active');
}

function toggleCommModal() {
    const modal = document.getElementById('commModal');
    modal.classList.toggle('active');
}

function toggleChecklistModal() {
    const modal = document.getElementById('checklistModal');
    modal.classList.toggle('active');
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// ===== Document Generation =====
function generatePolicyDoc() {
    const policyContent = generateIRPolicyContent();
    downloadDocument('IR_Policy_and_Roles_Chart.md', policyContent);
    showNotification('Policy document generated! 📄');
}

function generatePlaybook() {
    const playbookContent = generatePlaybookContent();
    downloadDocument('IR_Playbook_Template.md', playbookContent);
    showNotification('Playbook template generated! 📚');
}

function generateIRPolicyContent() {
    return `# Incident Response Policy & Roles Chart

## Document Information
- **Version:** 1.0
- **Date:** ${new Date().toLocaleDateString()}
- **Classification:** Internal

---

## 1. Policy Objectives

This Incident Response Policy establishes the framework for identifying, responding to, and recovering from security incidents. The objectives are:

- Minimize the impact of security incidents on business operations
- Ensure rapid and effective incident response
- Preserve evidence for potential legal proceedings
- Meet regulatory compliance requirements
- Enable continuous improvement through lessons learned

---

## 2. Scope

This policy applies to:
- All employees, contractors, and third-party personnel
- All information systems and assets
- All locations and remote work environments

---

## 3. IRT Organization Structure

### 3.1 Team Composition

| Role | Primary Contact | Backup Contact | Phone |
|------|-----------------|----------------|-------|
| IR Manager | [Name] | [Name] | [Phone] |
| Lead Investigator | [Name] | [Name] | [Phone] |
| Forensic Analyst | [Name] | [Name] | [Phone] |
| Communications Lead | [Name] | [Name] | [Phone] |
| Legal/Compliance | [Name] | [Name] | [Phone] |

### 3.2 Role Descriptions

#### IR Manager
**Responsibilities:**
- Overall coordination of incident response activities
- Making critical decisions regarding containment and recovery
- Managing stakeholder communications
- Allocating resources and personnel
- Authorizing major response actions

**Authority Level:** Full incident response authority

#### Lead Investigator
**Responsibilities:**
- Leading technical investigation efforts
- Analyzing attack vectors and threat actor behavior
- Coordinating with forensic team
- Documenting technical findings
- Recommending containment strategies

**Authority Level:** Technical decision authority

#### Forensic Analyst
**Responsibilities:**
- Collecting and preserving digital evidence
- Analyzing memory dumps, logs, and artifacts
- Creating forensic timeline
- Maintaining chain of custody
- Preparing evidence for potential legal proceedings

**Authority Level:** Evidence collection authority

#### Communications Lead
**Responsibilities:**
- Drafting internal notifications
- Preparing external statements (with PR/Legal approval)
- Coordinating with PR and Legal teams
- Maintaining communication logs
- Managing stakeholder updates

**Authority Level:** Communication coordination

#### Legal/Compliance
**Responsibilities:**
- Advising on regulatory requirements
- Reviewing breach notification requirements
- Coordinating with law enforcement if needed
- Documenting compliance actions
- Assessing legal implications

**Authority Level:** Legal advisory

---

## 4. RACI Matrix

| Activity | IR Manager | Lead Investigator | Forensic Analyst | Comms Lead | Legal |
|----------|-----------|-------------------|------------------|------------|-------|
| Incident Declaration | A | R | C | I | C |
| Technical Investigation | A | R | R | I | I |
| Evidence Collection | A | C | R | I | C |
| Containment Decision | R/A | R | C | I | C |
| Stakeholder Communication | A | I | I | R | C |
| Regulatory Notification | A | I | I | R | R |
| Post-Incident Review | A | R | R | R | R |

**Legend:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 5. Escalation Procedures

### Severity Levels

| Level | Description | Response Time | Escalate To |
|-------|-------------|---------------|-------------|
| Critical | Active breach, data exfiltration, ransomware | 15 minutes | CISO, Executive Team |
| High | Confirmed malware, significant vulnerability | 1 hour | IR Manager, Department Heads |
| Medium | Suspicious activity, potential incident | 4 hours | IR Team Lead |
| Low | Minor security event, policy violation | 24 hours | Assigned Analyst |

---

## 6. Contact Information

### Emergency Contacts
- **IR Hotline:** +1-XXX-XXX-XXXX (24/7)
- **IR Email:** ir-team@company.com
- **Slack Channel:** #incident-response (private)

### External Contacts
- **Legal Counsel:** [Contact]
- **Cyber Insurance:** [Contact]
- **Law Enforcement:** [Local FBI/Police Contact]
- **PR Agency:** [Contact]

---

## 7. Policy Review

This policy will be reviewed and updated:
- Annually, at minimum
- After any significant incident
- When there are major organizational changes
- When regulatory requirements change

---

**Approved By:** ____________________
**Date:** ____________________
`;
}

function generatePlaybookContent() {
    return `# Incident Response Playbook Template

## Document Information
- **Version:** 1.0
- **Date:** ${new Date().toLocaleDateString()}
- **Classification:** Internal

---

## Table of Contents
1. [Phishing Response](#1-phishing-response)
2. [Malware/Ransomware Response](#2-malwareransomware-response)
3. [Data Breach Response](#3-data-breach-response)
4. [Insider Threat Response](#4-insider-threat-response)
5. [Network Intrusion Response](#5-network-intrusion-response)

---

## 1. Phishing Response

### 1.1 Identification
- [ ] User reports suspicious email
- [ ] Security tools detect phishing attempt
- [ ] Verify email headers and sender information
- [ ] Check for malicious links or attachments
- [ ] Identify potential victims

### 1.2 Containment
- [ ] Block sender domain/IP at email gateway
- [ ] Remove email from all mailboxes
- [ ] Disable compromised accounts temporarily
- [ ] Block malicious URLs at proxy/firewall
- [ ] Alert security team and management

### 1.3 Investigation
- [ ] Analyze email headers and content
- [ ] Check who received/opened the email
- [ ] Identify who clicked links or opened attachments
- [ ] Assess credential exposure
- [ ] Review authentication logs

### 1.4 Eradication & Recovery
- [ ] Reset passwords for affected accounts
- [ ] Enable MFA if not already active
- [ ] Scan affected systems for malware
- [ ] Update email filtering rules
- [ ] Verify no persistent access

### 1.5 Post-Incident
- [ ] Document incident timeline
- [ ] Send awareness communication
- [ ] Update phishing simulations
- [ ] Review detection capabilities

---

## 2. Malware/Ransomware Response

### 2.1 Identification
- [ ] Antivirus/EDR alert triggered
- [ ] Unusual system behavior reported
- [ ] File encryption detected
- [ ] Ransom note discovered
- [ ] Network anomalies observed

### 2.2 Immediate Containment
- [ ] **CRITICAL:** Isolate affected systems from network
- [ ] Disable network shares
- [ ] Block C2 communications at firewall
- [ ] Preserve system state before changes
- [ ] Identify patient zero

### 2.3 Investigation
- [ ] Capture memory image
- [ ] Collect relevant logs
- [ ] Identify malware family/variant
- [ ] Determine infection vector
- [ ] Map lateral movement

### 2.4 Eradication & Recovery
- [ ] Remove malware from all systems
- [ ] Restore from clean backups
- [ ] Patch exploited vulnerabilities
- [ ] Reset all potentially compromised credentials
- [ ] Rebuild systems if necessary

### 2.5 Post-Incident
- [ ] Document lessons learned
- [ ] Update detection signatures
- [ ] Review backup procedures
- [ ] Enhance endpoint protection

---

## 3. Data Breach Response

### 3.1 Identification
- [ ] Data exfiltration detected
- [ ] Unauthorized access to sensitive data
- [ ] Third-party notification received
- [ ] Dark web monitoring alert
- [ ] Anomalous data transfers

### 3.2 Containment
- [ ] Revoke unauthorized access immediately
- [ ] Block data exfiltration channels
- [ ] Preserve evidence
- [ ] Identify scope of exposed data
- [ ] Notify Legal and Compliance

### 3.3 Investigation
- [ ] Determine what data was accessed/stolen
- [ ] Identify affected individuals
- [ ] Establish timeline of breach
- [ ] Determine attack vector
- [ ] Assess regulatory implications

### 3.4 Notification Requirements
- [ ] Assess notification obligations (GDPR, HIPAA, etc.)
- [ ] Prepare notification content
- [ ] Notify regulators within required timeframe
- [ ] Notify affected individuals
- [ ] Prepare public statement if needed

### 3.5 Recovery & Post-Incident
- [ ] Implement additional access controls
- [ ] Enhance monitoring
- [ ] Offer credit monitoring to affected individuals
- [ ] Complete regulatory documentation
- [ ] Conduct thorough post-mortem

---

## 4. Insider Threat Response

### 4.1 Identification
- [ ] DLP alert triggered
- [ ] Unusual access patterns detected
- [ ] HR/management reports concerns
- [ ] Excessive data downloads
- [ ] After-hours access anomalies

### 4.2 Containment
- [ ] Coordinate with HR and Legal before action
- [ ] Limit access privileges (covertly if investigation ongoing)
- [ ] Preserve evidence of activities
- [ ] Monitor ongoing activity
- [ ] Prepare for potential termination

### 4.3 Investigation
- [ ] Review access logs and activity
- [ ] Analyze data accessed/downloaded
- [ ] Check for policy violations
- [ ] Document evidence chain
- [ ] Coordinate with HR for employee interview

### 4.4 Resolution
- [ ] Remove access immediately upon decision
- [ ] Retrieve company assets
- [ ] Review and revoke all access
- [ ] Determine if external notification needed
- [ ] Consider law enforcement involvement

### 4.5 Post-Incident
- [ ] Review access control policies
- [ ] Enhance monitoring capabilities
- [ ] Update insider threat training
- [ ] Review separation procedures

---

## 5. Network Intrusion Response

### 5.1 Identification
- [ ] IDS/IPS alert triggered
- [ ] Unusual network traffic detected
- [ ] Unauthorized system access
- [ ] Suspicious authentication activity
- [ ] Beacon traffic identified

### 5.2 Containment
- [ ] Isolate compromised segments
- [ ] Block attacker IP addresses
- [ ] Disable compromised accounts
- [ ] Implement emergency firewall rules
- [ ] Activate enhanced logging

### 5.3 Investigation
- [ ] Analyze network traffic captures
- [ ] Review firewall and proxy logs
- [ ] Identify compromised systems
- [ ] Map attacker's movements
- [ ] Identify persistence mechanisms

### 5.4 Eradication & Recovery
- [ ] Remove attacker access and persistence
- [ ] Patch exploited vulnerabilities
- [ ] Reset compromised credentials
- [ ] Verify system integrity
- [ ] Gradually restore services

### 5.5 Post-Incident
- [ ] Document attack techniques (MITRE ATT&CK)
- [ ] Update detection rules
- [ ] Enhance network segmentation
- [ ] Review access controls
- [ ] Consider threat hunting

---

## Appendix A: Evidence Collection Checklist

### Digital Evidence
- [ ] Memory dumps
- [ ] Hard drive images
- [ ] Log files (system, application, security)
- [ ] Network captures
- [ ] Email headers and content
- [ ] Screenshots

### Documentation
- [ ] Timeline of events
- [ ] Actions taken
- [ ] Personnel involved
- [ ] Chain of custody forms
- [ ] Communication logs

---

## Appendix B: Communication Templates

### Internal Notification Template
\`\`\`
Subject: [SEVERITY] Security Incident - [Brief Description]

Team,

A security incident has been identified requiring immediate attention.

Incident ID: [ID]
Severity: [Critical/High/Medium/Low]
Status: [Active/Contained/Resolved]

Summary: [Brief description]

Required Actions: [What team members need to do]

Updates will be provided via [channel].

IR Team
\`\`\`

### External Notification Template
\`\`\`
Subject: Important Security Notice

Dear [Customer/Partner],

We are writing to inform you of a security incident that may affect your information.

What Happened: [Description]

What Information Was Involved: [Details]

What We Are Doing: [Actions taken]

What You Can Do: [Recommended actions]

For More Information: [Contact details]

We apologize for any inconvenience and remain committed to protecting your information.

Sincerely,
[Organization Name]
\`\`\`

---

**Document maintained by:** Incident Response Team
**Last Review Date:** ${new Date().toLocaleDateString()}
`;
}

function downloadDocument(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== Preview Functions =====
function previewPolicy() {
    showNotification('Opening policy preview... 📋');
    // In a real implementation, this would open a preview modal
    toggleRolesModal();
}

function previewPlaybook() {
    showNotification('Opening playbook preview... 📖');
    // In a real implementation, this would open a preview modal
    toggleChecklistModal();
}

// ===== Quick Actions =====
function startIncidentSimulation() {
    const completed = Array.from(taskCheckboxes).filter(cb => cb.checked).length;
    if (completed < 3) {
        showNotification('Complete Week 1 tasks before starting simulation! ⚠️', 'warning');
        return;
    }
    showNotification('Week 2 Simulation module coming soon! 🚀');
}

function exportDocuments() {
    generatePolicyDoc();
    setTimeout(() => generatePlaybook(), 500);
    showNotification('All documents exported! 📦');
}

function scheduleTraining() {
    showNotification('Training scheduler coming soon! 📅');
}

function testCommunication() {
    showNotification('Communication test initiated! 📡');
}

// ===== Notification System =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add notification styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: #10b981;
                color: white;
                border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            }
            .notification.warning {
                background: #f59e0b;
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.25rem;
                cursor: pointer;
                opacity: 0.7;
            }
            .notification button:hover {
                opacity: 1;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// ===== Checklist Modal Persistence =====
function initChecklistModalListeners() {
    const checklistItems = document.querySelectorAll('.checklist-item input');
    checklistItems.forEach((item, index) => {
        item.addEventListener('change', () => {
            const savedChecklist = JSON.parse(localStorage.getItem('irChecklist') || '[]');
            savedChecklist[index] = item.checked;
            localStorage.setItem('irChecklist', JSON.stringify(savedChecklist));
        });
    });

    // Load saved checklist state
    const savedChecklist = JSON.parse(localStorage.getItem('irChecklist') || '[]');
    savedChecklist.forEach((checked, index) => {
        if (checklistItems[index]) {
            checklistItems[index].checked = checked;
        }
    });
}

// Initialize checklist listeners after DOM load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initChecklistModalListeners, 100);
});
