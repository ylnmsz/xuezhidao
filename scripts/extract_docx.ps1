$src="D:\\桌面\\bishe\\xuezhidao\\docx\\统编版2025学年小学六年级语文下册期中提优测试卷.docx"
$dst="xuezhidao\docx\docx_extract"
Remove-Item -Recurse -Force $dst -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $dst | Out-Null
try {
	$abs = (Get-Item -Path $src -ErrorAction Stop).FullName
} catch {
	Write-Error "Source file not found: $src"
	exit 2
}
Write-Host "Resolved source:" $abs
Expand-Archive -Path $abs -DestinationPath $dst -Force
$docPath=Join-Path $dst 'word\document.xml'
if (-Not (Test-Path $docPath)) { Write-Error 'document.xml not found'; exit 3 }
$xml = Get-Content -Path $docPath -Raw
$text = [regex]::Replace($xml, '<w:t[^>]*>([\s\S]*?)</w:t>', '$1', 'Singleline')
$text = $text -replace '<[^>]+>',''
$text = $text -replace "`r`n","`n"
$text = $text -replace "`n{3,}","`n`n"
Set-Content -Path 'xuezhidao\docx\extracted_text.txt' -Value $text -Encoding utf8
$images = @()
$mediaPath=Join-Path $dst 'word\media'
if (Test-Path $mediaPath) { Get-ChildItem -Path $mediaPath -File | ForEach-Object { $images += $_.Name } }
$out = @{ source=$src; images=$images; textSnippet = $text.Substring(0,[Math]::Min(2000,$text.Length)); fullTextPath='docx/extracted_text.txt' } | ConvertTo-Json -Depth 10
Set-Content -Path 'xuezhidao\docx\extracted_text.json' -Value $out -Encoding utf8
Write-Host 'Extraction complete.'
