$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:8000/')

try {
  $listener.Start()
  Write-Host "APS Math Library: http://127.0.0.1:8000"
  Write-Host 'Press Ctrl+C to stop.'

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $relativePath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($relativePath)) { $relativePath = 'index.html' }
    $filePath = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))
    $rootPrefix = $root.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar

    if (-not $filePath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
      $context.Response.StatusCode = 404
      $context.Response.Close()
      continue
    }

    $extension = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
    $context.Response.ContentType = switch ($extension) {
      '.html' { 'text/html; charset=utf-8' }
      '.css' { 'text/css; charset=utf-8' }
      '.js' { 'text/javascript; charset=utf-8' }
      '.json' { 'application/json; charset=utf-8' }
      '.pdf' { 'application/pdf' }
      '.png' { 'image/png' }
      '.tex' { 'text/plain; charset=utf-8' }
      default { 'application/octet-stream' }
    }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $context.Response.ContentLength64 = $bytes.Length
    if ($context.Request.HttpMethod -ne 'HEAD') {
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $context.Response.Close()
  }
}
finally {
  if ($listener.IsListening) { $listener.Stop() }
  $listener.Close()
}
