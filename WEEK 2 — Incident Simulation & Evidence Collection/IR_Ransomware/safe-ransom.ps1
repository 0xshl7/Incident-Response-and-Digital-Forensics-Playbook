param(
  [string]$TargetPath = "C:\Users\whoami\Documents",
  [string]$EvidencePath = "C:\Evidence"
)
$ts = (Get-Date).ToString("u")
New-Item -ItemType Directory -Path "$EvidencePath\sim_outputs" -Force | Out-Null
"$ts - START RANSOM SIM" | Out-File "$EvidencePath\sim_outputs\sim_log.txt" -Append

$note = @"
Your files are "locked". To recover, contact attacker@example.local
(This is a LAB SIMULATION - NO PAYMENT)
"@
$note | Out-File -FilePath (Join-Path $TargetPath "README_RECOVER.txt")

Get-ChildItem -Path $TargetPath -File -Recurse | ForEach-Object {
    $src = $_.FullName
    $dest = "$src.locked"
    Copy-Item -Path $src -Destination $dest -Force
    "$ts COPIED $src -> $dest" | Out-File "$EvidencePath\sim_outputs\sim_log.txt" -Append
}
"$ts - END RANSOM SIM" | Out-File "$EvidencePath\sim_outputs\sim_log.txt" -Append
Write-Output "Simulation completed. Check $EvidencePath for logs."
