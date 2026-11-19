# ECAB STOR Premium v7 — safe files-only install.
# Run from PowerShell in the site root containing index.html.
[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot
)
$ErrorActionPreference = 'Stop'
$project = [System.IO.Path]::GetFullPath($ProjectRoot)
$source = Join-Path $PSScriptRoot 'Website\ecab-stor'
if (-not (Test-Path (Join-Path $project 'index.html'))) {
  throw "Project root doesn't contain index.html: $project"
}
if (-not (Test-Path (Join-Path $project 'apps-data.js'))) {
  throw "Project root doesn't contain apps-data.js: $project"
}
if (-not (Test-Path (Join-Path $project 'assets'))) {
  throw "Project root doesn't contain assets/: $project"
}
$files = @('index.html','app.js','studio.html','404.html','robots.txt','sitemap.xml','.nojekyll','assets\ecab-premium-v7.css')
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backup = Join-Path ([System.IO.Path]::GetTempPath()) "ECAB_STOR_Premium_v7_backup_$stamp"
New-Item -ItemType Directory -Path $backup -Force | Out-Null
foreach ($rel in $files) {
  $from = Join-Path $source $rel
  if (-not (Test-Path -LiteralPath $from)) { throw "Patch file missing: $from" }
  $to = Join-Path $project $rel
  if (Test-Path -LiteralPath $to) {
    $old = Join-Path $backup $rel
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $old) | Out-Null
    Copy-Item -LiteralPath $to -Destination $old -Force
  }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $to) | Out-Null
  Copy-Item -LiteralPath $from -Destination $to -Force
  Write-Host "Updated: $rel"
}
Write-Host ''
Write-Host "Installed ECAB STOR Premium v7 to: $project" -ForegroundColor Green
Write-Host "Backup of replaced files: $backup"
Write-Host 'Preserved: apps-data.js, github-releases.js, CNAME, existing art assets, TV Mode scripts, existing CSS.'
Write-Host 'Review the website locally, then publish changed files to GitHub Pages.'
