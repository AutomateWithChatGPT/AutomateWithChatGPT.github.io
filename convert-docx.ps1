param(
    [Parameter(Mandatory=$true)]
    [string]$InputDir,             # e.g. .\source-docx
    [string]$OutputDir = ".\docs", # where Markdown is written
    [switch]$CleanOutput           # wipe docs/ first
)

function Assert-Exe($name) {
    $exe = (Get-Command $name -ErrorAction SilentlyContinue)
    if (-not $exe) { throw "Required executable '$name' not found in PATH." }
}

function Slugify([string]$name) {
    $slug = $name.
        ToLowerInvariant().
        Replace("’","'").
        Replace("&"," and ").
        Replace("@"," at ").
        Replace("#"," number ").
        Replace("+"," plus ")
    $slug = -join ($slug.ToCharArray() | ForEach-Object {
        if ($_ -match '[a-z0-9]') { $_ }
        elseif ($_ -match '[\s\-\._]') { '-' } else { '' }
    })
    $slug = $slug -replace '-+','-'
    $slug.Trim('-')
}

# --- checks ---
Assert-Exe pandoc

# Normalize paths
$InputDir  = (Resolve-Path $InputDir).Path
$OutputDir = (Resolve-Path $OutputDir -ErrorAction SilentlyContinue) ?? (Join-Path (Get-Location) "docs")

if ($CleanOutput -and (Test-Path $OutputDir)) {
    Write-Host "Cleaning $OutputDir"
    Remove-Item $OutputDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# Find DOCX recursively
$docxFiles = Get-ChildItem -Path $InputDir -Recurse -File -Include *.docx
if (-not $docxFiles) {
    Write-Host "No .docx found under $InputDir"
    exit 0
}

foreach ($f in $docxFiles) {
    # Mirror folder structure under docs/
    $relPathFromInput = $f.DirectoryName.Substring($InputDir.Length).TrimStart('\','/')
    $targetDir = if ($relPathFromInput) { Join-Path $OutputDir $relPathFromInput } else { $OutputDir }
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    $slug = Slugify $baseName
    $mdPath = Join-Path $targetDir ($slug + ".md")

    # Pandoc DOCX -> GitHub-flavored Markdown (no media extract)
    $pandocArgs = @(
        "--from=docx",
        "--to=gfm",
        "--wrap=none",
        "--shift-heading-level-by=1",  # makes document's first heading subordinate to page title
        "--resource-path=""$($f.DirectoryName)""",
        "--output=""$mdPath""",
        """$($f.FullName)"""
    )

    Write-Host "Converting: $($f.FullName) -> $mdPath"
    $p = Start-Process -FilePath "pandoc" -ArgumentList $pandocArgs -NoNewWindow -Wait -PassThru
    if ($p.ExitCode -ne 0) { throw "Pandoc failed for $($f.FullName)" }

    # YAML front matter for MkDocs Material
    $title = $baseName
    $content = Get-Content -LiteralPath $mdPath -Raw
    $frontMatter = @"
---
title: "$title"
---

"@
    Set-Content -LiteralPath $mdPath -Value ($frontMatter + $content) -Encoding UTF8
}

# Create an index if none exists
$indexPath = Join-Path $OutputDir "index.md"
if (-not (Test-Path $indexPath)) {
@"
# Welcome

Browse using the left navigation or search.
"@ | Set-Content -LiteralPath $indexPath -Encoding UTF8
}

Write-Host "Done. Markdown at: $OutputDir"
