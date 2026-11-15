param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectRoot
)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $ProjectRoot).Path
if (-not (Test-Path -LiteralPath (Join-Path $root 'index.html'))) {
  $nested = Join-Path $root 'ecab-stor'
  if (Test-Path -LiteralPath (Join-Path $nested 'index.html')) { $root = $nested }
}
$indexPath = Join-Path $root 'index.html'
if (-not (Test-Path -LiteralPath $indexPath) -or
    -not (Test-Path -LiteralPath (Join-Path $root 'app.js')) -or
    -not (Test-Path -LiteralPath (Join-Path $root 'styles.css'))) {
  throw "This is not an ECAB STOR website folder: $root"
}
$source = Join-Path $PSScriptRoot 'assets'
foreach ($name in @('ecab-tv.css','ecab-tv.js')) {
  if (-not (Test-Path -LiteralPath (Join-Path $source $name))) {throw "Missing patch file: assets/$name"}
}
$backup = Join-Path $root ('ECAB_STOR_TV_v6_backup_' + (Get-Date -Format 'yyyyMMdd_HHmmss'))
New-Item -ItemType Directory -Path (Join-Path $backup 'assets') -Force | Out-Null
Copy-Item -LiteralPath $indexPath -Destination (Join-Path $backup 'index.html')
$destination = Join-Path $root 'assets'
New-Item -ItemType Directory -Path $destination -Force | Out-Null
foreach ($name in @('ecab-tv.css','ecab-tv.js')) {
  $dest = Join-Path $destination $name
  if (Test-Path -LiteralPath $dest) {
    Copy-Item -LiteralPath $dest -Destination (Join-Path (Join-Path $backup 'assets') $name)
  }
  Copy-Item -LiteralPath (Join-Path $source $name) -Destination $dest -Force
  Write-Host "Updated: assets/$name"
}
$text = [IO.File]::ReadAllText($indexPath)
if (-not $text.Contains('assets/ecab-tv.css')) {
  if (-not $text.Contains('</head>')) { throw 'index.html is missing </head>' }
  $text = $text.Replace('</head>', '  <link rel="stylesheet" href="assets/ecab-tv.css" />' + "`r`n" + '</head>')
}
if (-not $text.Contains('assets/ecab-tv.js')) {
  if (-not $text.Contains('</head>')) { throw 'index.html is missing </head>' }
  $text = $text.Replace('</head>', '  <script src="assets/ecab-tv.js" defer></script>' + "`r`n" + '</head>')
}
[IO.File]::WriteAllText($indexPath, $text, [System.Text.UTF8Encoding]::new($false))
Write-Host 'Updated: index.html (two TV assets linked, other HTML preserved)'
Write-Host "Backup: $backup"
Write-Host 'SUCCESS: TV mode installed. Open index.html?tv=1 to preview.'
Write-Host 'GitHub Pages: Upload index.html and assets/ecab-tv.css + ecab-tv.js to main.'
