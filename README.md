# Incident-Response-and-Digital-Forensics-Playbook

By:
 1- Sohail Yasser Sayed 
 2- Ahmed Abdelmonem Sherif 
 3- Mohamed Mohsen Elsaied 
 4- Mohamed Mahmoud Wafik 
 5- Khaled Gamal Abdelhalim


📌 Overview

This project simulates the complete Incident Response (IR) lifecycle, covering preparation, attack simulation, evidence collection, containment, eradication, recovery, and final reporting.
The goal is to demonstrate real-world SOC/DFIR workflows through phishing and ransomware scenarios executed in a controlled lab environment.

📆 Project Structure
Week 1 — Preparation

Defined IR Team roles and communication workflow
Created IR playbook and escalation checklist
Set incident logging and reporting structure

✔ Deliverables:

IR Policy
Roles & Responsibilities
IR Checklist

Week 2 — Incident Simulation & Evidence Collection
Simulated a multi-stage attack involving:

📨 Stage 1: Phishing Attack (MailHog)

Generated phishing email
Captured header artifacts
Logged delivery timestamp

🔐 Stage 2: Ransomware Execution

Executed safe-ransom.ps1
Encrypted files (.locked)
Dropped ransom note README_RECOVER.txt

📁 Evidence Collected

Encrypted files
Ransom note
PowerShell script
Memory image
Event logs
Hashes (SHA-256)

Incident timeline (CSV)

✔ Deliverables:
Evidence directory
Timeline file
Hashes file

Week 3 — Containment, Eradication & Recovery
🛑 Containment

Isolated infected endpoint
Blocked malicious URL & IP
Quarantined phishing emails

🧹 Eradication

Removed malicious script
Checked for persistence (registry/tasks)
Deleted phishing artifacts

🔄 Recovery

Restored system from clean backup
Reconnected endpoint after verification
Added IoCs to SIEM/EDR

✔ Deliverables:

Root Cause Analysis
Containment steps
Eradication plan
Recovery documentation

Week 4 — Post-Incident Activities
📘 Lessons Learned

Highlighted failures in email authentication
Identified user awareness gaps
Noted lack of endpoint execution restrictions
Improved detection, training, and IR workflows

📊 Final Reporting

Executive summary
Attack chain visualization
Forensic analysis
IoCs list

Recommendations & remediation plan

✔ Deliverables:
Final Report (PDF)
IR Dashboard
Presentation (PPTX)

🧪 Tools Used
Category	Tools
Phishing Simulation	MailHog, GoPhish
Malware Simulation	PowerShell (safe-ransom.ps1)
Forensics	Event Viewer, SHA256 hashing, memory image
IR Documentation	CSV logs, Markdown, PDF reports
Version Control	GitHub

📂 Project Repository Structure
/WEEK 1 — Preparation
/WEEK 2 — Incident Simulation & Evidence Collection
/WEEK 3 — Containment & Recovery
/WEEK 4 — Final Reports
README.md

🛡️ Key Findings

Email authentication (SPF/DMARC/DKIM) missing → phishing success
PowerShell execution allowed → ransomware success
No endpoint protection prevented script execution

🚀 Final Outcome

The Incident Response Team successfully:
✔ Detected the attack
✔ Contained the infected system
✔ Removed the malware
✔ Recovered from clean backup
✔ Documented full IR lifecycle

This repository demonstrates end-to-end SOC/DFIR workflow suitable for academic assessment and real-world SOC training.

Team Members:
 1- Sohail Yasser Sayed 
 2- Ahmed Abdelmonem Sherif 
 3- Mohamed Mohsen Elsaied 
 4- Mohamed Mahmoud Wafik 
 5- Khaled Gamal Abdelhalim

