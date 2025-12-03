#!/bin/bash
mkdir -p ~/ir_project/pcaps
OUT=~/ir_project/pcaps/gophish_$(date +%F_%H%M%S).pcap
echo "Starting tcpdump -> $OUT (running in background via nohup)"
sudo nohup tcpdump -i eth0 host 192.168.159.128 -w "$OUT" >/dev/null 2>&1 &
sleep 1
ps aux | grep tcpdump | grep -v grep || echo "[!] tcpdump not found"
