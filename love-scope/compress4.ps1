Add-Type -AssemblyName System.Drawing

$baseDir = Join-Path $PSScriptRoot "assets\illustration"
$maxWidth = 480
$quality = 55
$bgColor = [System.Drawing.Color]::FromArgb(45, 27, 94)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

$totalBefore = 0
$totalAfter = 0
$count = 0

Get-ChildItem -Path $baseDir -Recurse -Include "*.jpg","*.jpeg" | ForEach-Object {
    $file = $_.FullName
    $originalSize = $_.Length
    $totalBefore += $originalSize

    try {
        $img = [System.Drawing.Image]::FromFile($file)

        $newWidth = $img.Width
        $newHeight = $img.Height
        if ($img.Width -gt $maxWidth) {
            $newWidth = $maxWidth
            $newHeight = [int]($img.Height * $maxWidth / $img.Width)
        }

        $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear($bgColor)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
        $img.Dispose()

        $bmp.Save($file, $jpegCodec, $encoderParams)
        $bmp.Dispose()

        $newSize = (Get-Item $file).Length
        $totalAfter += $newSize
        $count++
        Write-Host "  $($_.Name): $([math]::Round($originalSize/1KB))KB -> $([math]::Round($newSize/1KB))KB"
    } catch {
        Write-Host "  FAIL $($_.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========== DONE ==========" -ForegroundColor Green
Write-Host "Compressed: $count images"
Write-Host "Before: $([math]::Round($totalBefore/1KB))KB"
Write-Host "After: $([math]::Round($totalAfter/1KB))KB"
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
