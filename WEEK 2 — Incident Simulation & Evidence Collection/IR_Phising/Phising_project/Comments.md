
# Incident Response Phishing Simulation Project

## Overview

This project demonstrates a complete Incident Response (IR) workflow using **Gophish** and **MailHog** to simulate a phishing attack, collect evidence, and generate forensic artifacts. The entire process includes environment preparation, campaign execution, data logging, packet capturing, and exporting campaign results for analysis.

---

## 1. Project Structure Setup

Create the IR project directory with all required subfolders:

```bash
mkdir -p ~/IR_Project/{templates,pcaps,logs,evidence,docs,db,timeline,exports,scripts}
cd ~/IR_Project
```

Each folder is used for collecting a specific type of evidence:

* **pcaps** – network captures
* **logs** – Gophish and MailHog logs
* **exports** – CSV results exported from Gophish
* **timeline** – timeline of events
* **evidence** – any manual forensic evidence
* **scripts** – collection scripts
* **templates** – phishing email + landing pages
* **docs** – final IR report

---

## 2. MailHog Setup (Fake Email Server)

MailHog simulates an SMTP server to receive phishing emails.

### Stop previous instances

```bash
sudo docker stop mailhog
sudo docker rm mailhog
```

### Launch new MailHog container

```bash
sudo docker run -d \
--name mailhog \
-p 8025:8025 \
-p 1025:1025 \
mailhog/mailhog
```

### Verify MailHog is running

```bash
sudo docker ps --filter "name=mailhog"
```

### Open MailHog interface

Visit in browser:

```
http://<YOUR-IP>:8025
```

Example:

```
http://192.168.159.130:8025
```

---

## 3. Gophish Setup (Phishing Framework)

### Extract and prepare Gophish

```bash
unzip gophish*.zip -d gophish
cd gophish
chmod +x gophish
```

### Launch Gophish

```bash
./gophish &> ~/IR_Project/logs/gophish.log &
```

### Access Admin Panel

```
https://127.0.0.1:3333
```

---

## 4. Linking Gophish with MailHog

Go to **Sending Profiles → New Profile** and enter:

* **SMTP Server:** your machine IP (e.g., 192.168.159.130)
* **Port:** 1025
* **Username/Password:** leave empty
* **Ignore Certificates:** ✓ enabled

This ensures all phishing emails go to MailHog instead of being actually delivered.

---

## 5. Creating a Phishing Campaign

In Gophish:

1. Create **Landing Page**
2. Create **Email Template**
3. Configure **Sending Profile** (MailHog)
4. Add **Users & Groups** (victims)
5. Create **Campaign** and press **Launch**

Gophish will begin sending phishing emails to MailHog.

---

## 6. Evidence Collection Script

Create the script file:

```bash
nano ~/IR_Project/scripts/collect_artifacts.sh
```

Paste the following script:

```bash
#!/bin/bash

BASE="$HOME/IR_Project"

# Save Gophish log
cp ~/gophish/gophish.log $BASE/logs/gophish_$(date +"%F_%T").log

# Save MailHog log
sudo docker logs mailhog > $BASE/logs/mailhog_$(date +"%F_%T").log

# Capture network traffic
tcpdump -i any -w $BASE/pcaps/capture_$(date +"%F_%T").pcap &
PID=$!
read -p "Press ENTER to stop capture"
sudo kill $PID

# Export Gophish campaign CSV
curl -k \
-H "Authorization: Bearer $(cat ~/gophish/api_key)" \
https://127.0.0.1:3333/api/campaigns/1/results \
-o $BASE/exports/results_$(date +"%F_%T").csv

# Update timeline
echo "$(date +"%F %T") - Campaign executed" >> $BASE/timeline/timeline.txt
```

### Save and exit:

* **CTRL + O** → Enter
* **CTRL + X**

### Make script executable

```bash
chmod +x ~/IR_Project/scripts/collect_artifacts.sh
```

---

## 7. Running the Phishing Operation

### Step 1 — Start the Campaign

In Gophish → press **Launch Campaign**.

### Step 2 — Collect Evidence

Run:

```bash
~/IR_Project/scripts/collect_artifacts.sh
```

The script will:

* Save Gophish logs
* Save MailHog logs
* Capture network traffic
* Export results (CSV)
* Update IR timeline

---

## 8. Evidence Locations

| Artifact Type  | Path                                 |
| -------------- | ------------------------------------ |
| PCAP files     | `~/IR_Project/pcaps/`                |
| CSV results    | `~/IR_Project/exports/`              |
| Logs           | `~/IR_Project/logs/`                 |
| Timeline       | `~/IR_Project/timeline/timeline.txt` |
| Extra Evidence | `~/IR_Project/evidence/`             |

---

## Summary

This project demonstrates a full Incident Response investigation workflow:

* Building an isolated IR environment
* Running a simulated phishing attack
* Collecting forensic artifacts automatically
* Exporting results for reporting
* Maintaining a timeline of events

You now have a complete forensic dataset ready for analysis and presentation.

---

**End of README**






















































































































































































# ======================================================
# ir_project — commands history (نفّذت على Kali)
# ده اللى اتعمل بالظبط تحت: ~/ir_project
# ======================================================

cd ~
# دخلت الهوم

# 1) إنشاء شجره المشروع  
mkdir -p ~/ir_project/{evidence,evidence_from_win,docs,mailhog,gophish,scripts}
# عملت الفولدرات الرئيسية للمشروع

cd ~/ir_project
pwd
# اتأكدت المسار: ~/ir_project

# 2) الملفات اللي عملتها جوه www عبر الـ GUI (مذكور هنا للوثائق)
# ملاحظة: صفحات الـ landing و قالب الايميل اتعملوا من واجهة GoPhish UI، مش بالكود.
# لو عايز تحفظ نسخة محلية من HTML:
mkdir -p ~/ir_project/www
# (لو عندك HTML جاهز من الواجهة انسخه هنا)
# cp /path/to/saved_landing.html ~/ir_project/www/landing.html
# cp /path/to/saved_email_template.html ~/ir_project/www/email_template.html

# 3) لو محتاج تنزل MailHog (لو مش موجود)
wget -qO ~/ir_project/mailhog/MailHog https://github.com/mailhog/MailHog/releases/latest/download/MailHog_linux_amd64
chmod +x ~/ir_project/mailhog/MailHog
# نزلت ثنائي MailHog وحطيته في فولدر المشروع

# 4) سكربت تشغيل MailHog (لو مش معمول)
cat > ~/ir_project/mailhog/start_mailhog.sh <<'SH'
#!/usr/bin/env bash
nohup ~/ir_project/mailhog/MailHog -smtp-bind-addr 0.0.0.0:1025 -api-bind-addr 0.0.0.0:8025 > ~/ir_project/logs/mailhog.log 2>&1 &
echo $! > ~/ir_project/logs/mailhog.pid
echo "MailHog started (SMTP:1025, UI:8025) - log: ~/ir_project/logs/mailhog.log"
SH
chmod +x ~/ir_project/mailhog/start_mailhog.sh
# عملت سكربت يشغّل MailHog في الخلفية

# 5) تشغيل MailHog
~/ir_project/mailhog/start_mailhog.sh
sleep 1
ss -tlnp | egrep '1025|8025' || true
# اتأكدت انه MailHog شغال وبيستمع على 1025 و8025

# 6) تنزيل GoPhish لو مش موجود (مثال v0.12.1)
wget -qO /tmp/gophish.zip https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip
unzip -o /tmp/gophish.zip -d /tmp/gophish_unpacked
mkdir -p ~/ir_project/gophish
mv -v /tmp/gophish_unpacked/* ~/ir_project/gophish/ 2>/dev/null || true
chmod +x ~/ir_project/gophish/gophish || true
# نزلت ووضعت ثنائي GoPhish في فولدر المشروع

# 7) عدّلت config بتاع GoPhish لو احتاج (عشان يشتغل على كل الواجهات)
if [ -f ~/ir_project/gophish/config.json ]; then
  cp ~/ir_project/gophish/config.json ~/ir_project/gophish/config.json.bak 2>/dev/null || true
  if command -v jq >/dev/null 2>&1; then
    jq '.admin_server.listen_url="0.0.0.0:3333" | .phish_server.listen_url="0.0.0.0:8080"' ~/ir_project/gophish/config.json > ~/ir_project/gophish/config.tmp && mv ~/ir_project/gophish/config.tmp ~/ir_project/gophish/config.json || true
  fi
fi
# لو فيه config، حطّيته عشان admin على 3333 و phish على 8080

# 8) شغّلت GoPhish وسجلت اللوق
mkdir -p ~/ir_project/gophish_logs
nohup ~/ir_project/gophish/gophish &> ~/ir_project/gophish_logs/gophish.log &
echo $! > ~/ir_project/gophish_logs/gophish.pid
sleep 2
ss -tlnp | egrep '3333|8080' || true
tail -n 60 ~/ir_project/gophish_logs/gophish.log || true
# شغلت GoPhish. اللوق في ~/ir_project/gophish_logs/gophish.log (هتلاقي فيه admin password المؤقت لو أول تشغيل)

# 9) في الواجهة (GUI) عملت الحاجات دي:
# - دخلت https://127.0.0.1:3333 و-login (admin + password من اللوق)
# - عملت Sending Profile (MailHog-Test) -> host: 127.0.0.1 port:1025 TLS:off
# - عملت Landing Page و Email Template (بصقت الـ HTML من واجهة الحفظ)
# - عملت Group/Targets (استوردت targets.csv أو ضفت ايميلات)
# - عملت Campaign و ضغطت Launch
# (دي حاجات عملتها من الGUI مش بكود، بس بسجّلها هنا علشان التوثيق)

# 10) بعثت ايميل اختبار باستخدام swaks عشان اتأكد MailHog بيقبض
sudo apt update -y
sudo apt install -y swaks jq curl sqlite3
swaks --to test@victim.local --from sender@lab.local --server 127.0.0.1:1025 --data "Subject: test mailh\n\nThis is a MailHog test"
# بعت ايميل اختبار وMailHog استقبله

# 11) حفظت كل الرسائل من MailHog كـ .eml (جمع الأدلة)
mkdir -p ~/ir_project/evidence/mailhog_eml
curl -s http://127.0.0.1:8025/api/v2/messages | jq -r '.items[].ID' | while read id; do
  safe=$(echo "$id" | sed 's/[^a-zA-Z0-9._-]/_/g')
  curl -s "http://127.0.0.1:8025/api/v2/messages/$id/raw" -o ~/ir_project/evidence/mailhog_eml/message_${safe}.eml
done
ls -lh ~/ir_project/evidence/mailhog_eml | sed -n '1,200p'
# خزّنت كل الرسائل الخام في evidence/mailhog_eml/

# 12) صدرّت نتائج الحملة من قاعدة GoPhish (لو موجودة)
if [ -f ~/ir_project/gophish/gophish.db ]; then
  sqlite3 -header -csv ~/ir_project/gophish/gophish.db "select * from results;" > ~/ir_project/evidence/results.csv 2>/dev/null || true
  echo "results exported to ~/ir_project/evidence/results.csv"
  head -n 20 ~/ir_project/evidence/results.csv || true
else
  echo "no gophish.db at ~/ir_project/gophish/gophish.db (maybe you used GUI and DB is elsewhere)"
fi
# لو DB موجود صدّرت الـresults كـ CSV

# 13) عملت timeline بسيط جمعت منه طوابع زمنية من MailHog وGoPhish log
mkdir -p ~/ir_project/docs
OUT=~/ir_project/docs/timeline.csv
echo "timestamp,event,detail" > "$OUT"
curl -s http://127.0.0.1:8025/api/v2/messages | jq -r '.items[] | [.Created, "mailhog_message", (.Content.Headers.Subject[0] // "")] | @csv' >> "$OUT"
if [ -f ~/ir_project/gophish_logs/gophish.log ]; then
  grep -E "Starting|Please login with|Starting phishing server|Sending" ~/ir_project/gophish_logs/gophish.log 2>/dev/null | sed 's/^/\"/;s/$/\",\"gophish\",\"log\"/' >> "$OUT"
fi
echo "timeline saved to $OUT"
head -n 30 "$OUT"
# احتفظت بالـ timeline في ~/ir_project/docs/timeline.csv

# 14) عملت سكربت PowerShell لجمع أدلة من ويندوز (حطيته في docs)
cat > ~/ir_project/docs/collect_evidence_ps1.txt <<'PS1'
# PowerShell snippet - run on Windows machine to collect artifacts
wevtutil epl System C:\Temp\System.evtx
wevtutil epl Security C:\Temp\Security.evtx
Compress-Archive -Path C:\Temp\* -DestinationPath C:\Temp\windows_artifacts.zip
PS1
# الملف ده بنقله لو احتاج اخد لوجات من ويندوز

# 15) عملت سكربت لأرشفة الأدلة والـ project
cat > ~/ir_project/scripts/archive_evidence.sh <<'SH'
#!/usr/bin/env bash
OUT=~/ir_project/ir_project_evidence_$(date +%F_%H%M).tgz
tar czf "$OUT" -C ~/ir_project evidence docs www gophish gophish_logs logs || true
sha256sum "$OUT" > "$OUT.sha256"
echo "Archive: $OUT"
echo "SHA: $OUT.sha256"
SH
chmod +x ~/ir_project/scripts/archive_evidence.sh
# جهزت سكربت يخرج الأرشيف النهائي ويعمل SHA

# 16) نفذت الأرشفة فعلاً
~/ir_project/scripts/archive_evidence.sh
ls -lh ~/ir_project/ir_project_evidence_*.tgz ~/ir_project/ir_project_evidence_*.sha256 || true
# الأرشيف اتعمل، وده اللي هتسلمه

# 17) ايقاف الخدمات لو محتاج (تنظيف بعد العرض)
if [ -f ~/ir_project/logs/mailhog.pid ]; then
  kill "$(cat ~/ir_project/logs/mailhog.pid)" 2>/dev/null || true
  rm -f ~/ir_project/logs/mailhog.pid
else
  sudo pkill -f MailHog || true
fi
if [ -f ~/ir_project/gophish_logs/gophish.pid ]; then
  kill "$(cat ~/ir_project/gophish_logs/gophish.pid)" 2>/dev/null || true
  rm -f ~/ir_project/gophish_logs/gophish.pid
else
  sudo pkill -f gophish || true
fi
ss -tlnp | egrep '1025|8025|3333|8080' || echo "services stopped"
# وقفّيت الخدمات بعد العرض لو احتجت

# ======================================================
# نهاية قائمة الأوامر اللى اتنفذت والملاحظات القصيرة
# ======================================================
