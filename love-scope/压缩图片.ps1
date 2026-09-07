# 月下签小程序 - 图片批量压缩脚本
# 用法：右键此文件 -> 使用PowerShell运行
# 作用：把所有PNG转成750px宽的JPG（深紫背景），代码包从30MB降到~1.5MB

Add-Type -AssemblyName System.Drawing

$baseDir = Join-Path $PSScriptRoot "assets\illustration"
$maxWidth = 750
$quality = 88
$bgColor = [System.Drawing.Color]::FromArgb(45, 27, 94)  # 深紫 #2d1b5e

# 获取JPEG编码器
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

$totalBefore = 0
$totalAfter = 0
$count = 0

Get-ChildItem -Path $baseDir -Recurse -Filter "*.png" | ForEach-Object {
    $file = $_.FullName
    $originalSize = $_.Length
    $totalBefore += $originalSize

    try {
        $img = [System.Drawing.Image]::FromFile($file)

        # 计算新尺寸
        $newWidth = $img.Width
        $newHeight = $img.Height
        if ($img.Width -gt $maxWidth) {
            $newWidth = $maxWidth
            $newHeight = [int]($img.Height * $maxWidth / $img.Width)
        }

        # 创建新位图（填充深紫背景）
        $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.Clear($bgColor)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
        $img.Dispose()

        # 保存为JPG
        $jpgPath = $file -replace '\.png$', '.jpg'
        $bmp.Save($jpgPath, $jpegCodec, $encoderParams)
        $bmp.Dispose()

        # 删除原PNG
        Remove-Item $file

        $newSize = (Get-Item $jpgPath).Length
        $totalAfter += $newSize
        $count++
        Write-Host "  $($_.Name): $([math]::Round($originalSize/1KB))KB -> $([math]::Round($newSize/1KB))KB"
    } catch {
        Write-Host "  失败 $($_.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========== 完成 ==========" -ForegroundColor Green
Write-Host "共压缩 $count 张图片"
Write-Host "压缩前: $([math]::Round($totalBefore/1MB, 2))MB"
Write-Host "压缩后: $([math]::Round($totalAfter/1MB, 2))MB"
Write-Host "节省: $([math]::Round(($totalBefore-$totalAfter)/1MB, 2))MB"
Write-Host ""
Write-Host "请按任意键退出..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
