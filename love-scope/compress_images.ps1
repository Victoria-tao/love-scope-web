# compress_images.ps1
# Compress MBTI cat images (jpg) in pages/personal/images to fit subpackage limit.
# Uses Windows built-in .NET (System.Drawing), no Python needed.
# Target: each file <= 105KB, quality auto-lowered as needed.

Add-Type -AssemblyName System.Drawing

$dir = "C:\Users\jd\Doubao\chats\2026-08-29\new-chat-2\love-scope\pages\personal\images"
$targetKB = 105
$minQuality = 30

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$total = 0
$count = 0

Get-ChildItem -Path $dir -Filter *.jpg | Sort-Object Name | ForEach-Object {
    $src = $_.FullName
    $tmp = $src + ".tmp"
    $q = 65
    $done = $false
    $size = 0

    while (-not $done) {
        $img = [System.Drawing.Image]::FromFile($src)
        $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$q)
        $img.Save($tmp, $encoder, $params)
        $img.Dispose()

        $size = (Get-Item $tmp).Length
        if ($size -le ($targetKB * 1024) -or $q -le $minQuality) {
            $done = $true
        } else {
            $q -= 10
        }
    }

    Move-Item -Path $tmp -Destination $src -Force
    $total += $size
    $count++
    Write-Host ("{0,-12} {1,7:N1} KB   quality={2}" -f $_.Name, ($size / 1KB), $q)
}

Write-Host ("--------------------------------")
Write-Host ("Compressed {0} files. Total: {1:N1} KB" -f $count, ($total / 1KB))
Write-Host "DONE"
