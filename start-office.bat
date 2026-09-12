@echo off
title Bot Office - PlanejamentoUTL
color 0B
echo.
echo   ========================================
echo     Bot Office Server v3
echo   ========================================
echo.
echo   URL:  http://localhost:8080
echo   Pasta: C:\BotOffice
echo   Para parar: feche esta janela
echo.

if not exist "C:\BotOffice" mkdir "C:\BotOffice"

:: --- Abre o Chrome com o sistema E a planilha online (em abas separadas) ---
start chrome "http://localhost:8080" "https://google.com"

:: --- SE FOR PLANILHA LOCAL (EXCEL), DESCOMENTE A LINHA ABAIXO REMOVENDO OS DOIS PONTOS (::) ---
:: start "" "C:\BotOffice\seu_arquivo.xlsx"

powershell -ExecutionPolicy Bypass -Command ^
  "$p=8080; $r='C:\BotOffice'; " ^
  "$l=New-Object Net.HttpListener; $l.Prefixes.Add('http://localhost:'+$p+'/'); " ^
  "try{$l.Start()}catch{Write-Host '  ERRO: Porta em uso' -F Red; Read-Host; exit}; " ^
  "Write-Host '  [OK] Servidor rodando!' -F Green; Write-Host ''; " ^
  "$m=@{'.html'='text/html; charset=utf-8';'.json'='application/json';'.js'='application/javascript';'.css'='text/css';'.txt'='text/plain';'.png'='image/png'}; " ^
  "while($true){ " ^
  "  $c=$l.GetContext(); $q=$c.Request; $s=$c.Response; " ^
  "  $u=$q.Url.LocalPath; if($u -eq '/'){$u='/bot_office.html'}; " ^
  "  $f=Join-Path $r $u.TrimStart('/'); " ^
  "  $s.Headers.Add('Access-Control-Allow-Origin','*'); " ^
  "  $s.Headers.Add('Cache-Control','no-cache,no-store'); " ^
  "  if($q.HttpMethod -eq 'POST'){ " ^
  "    $sr=New-Object IO.StreamReader($q.InputStream); $body=$sr.ReadToEnd(); $sr.Close(); " ^
  "    [IO.File]::WriteAllText($f,$body,[Text.Encoding]::UTF8); " ^
  "    $b=[Text.Encoding]::UTF8.GetBytes('OK'); " ^
  "    $s.ContentLength64=$b.Length; $s.OutputStream.Write($b,0,$b.Length); " ^
  "    Write-Host ('  ['+$(Get-Date -F 'HH:mm:ss')+'] POST '+$u) -F Cyan; " ^
  "  }elseif(Test-Path $f){ " ^
  "    $e=[IO.Path]::GetExtension($f); $ct=$m[$e]; if(-not $ct){$ct='application/octet-stream'}; " ^
  "    $b=[IO.File]::ReadAllBytes($f); $s.ContentType=$ct; " ^
  "    $s.ContentLength64=$b.Length; $s.OutputStream.Write($b,0,$b.Length); " ^
  "  }else{ " ^
  "    $s.StatusCode=404; $b=[Text.Encoding]::UTF8.GetBytes('404'); " ^
  "    $s.ContentLength64=$b.Length; $s.OutputStream.Write($b,0,$b.Length); " ^
  "  }; " ^
  "  $s.Close() " ^
  "}"

pause
