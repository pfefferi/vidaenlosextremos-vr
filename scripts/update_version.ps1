$msg = git log -1 --pretty=format:"%s"
$hash = git log -1 --pretty=format:"%h"
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$json = @{
    timestamp = $date
    message = $msg
    hash = $hash
} | ConvertTo-Json

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path (Get-Location) "data/version.json"), $json, $utf8NoBom)
Write-Host "Build Base Hash set to: $hash ($msg)"
