$root = Join-Path $PWD 'src/controllers'
Get-ChildItem -Path $root -Recurse -Filter '*.ts' | ForEach-Object {
  $path = $_.FullName
  $text = Get-Content -Path $path -Raw
  $usesRequest = $text -match 'req:\s*Request'
  $usesResponse = $text -match 'res:\s*Response'
  $usesNext = $text -match 'NextFunction'
  $hasImport = $text -match 'import\s+\{[^}]*\}\s+from\s+"express"'
  if (($usesRequest -or $usesResponse -or $usesNext) -and -not $hasImport) {
    Write-Output $path
  }
}
