# Script to download Roboto fonts for PDF generation
# Create the fonts directory
$fontsDir = "src/shared/infrastructure/fonts/Roboto"
New-Item -ItemType Directory -Force -Path $fontsDir | Out-Null

# Font URLs
$fontUrls = @{
    "Roboto-Regular.ttf" = "https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Regular.ttf"
    "Roboto-Medium.ttf" = "https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Medium.ttf"
    "Roboto-Italic.ttf" = "https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-Italic.ttf"
    "Roboto-MediumItalic.ttf" = "https://github.com/googlefonts/roboto/raw/main/src/hinted/Roboto-MediumItalic.ttf"
}

# Download each font
foreach ($font in $fontUrls.Keys) {
    $fontPath = Join-Path -Path $fontsDir -ChildPath $font
    Write-Host "Downloading $font to $fontPath..."
    Invoke-WebRequest -Uri $fontUrls[$font] -OutFile $fontPath
}

Write-Host "Font files downloaded successfully!"