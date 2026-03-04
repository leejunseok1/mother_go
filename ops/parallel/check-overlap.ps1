param(
  [string]$BaseBranch = "main",
  [string[]]$Branches = @(
    "parallel/agent-a-ui",
    "parallel/agent-b-analysis",
    "parallel/agent-c-answer-history"
  )
)

$ErrorActionPreference = "Stop"

function Resolve-GitCommand {
  $gitCmd = Get-Command git -ErrorAction SilentlyContinue
  if ($gitCmd) {
    return $gitCmd.Source
  }

  $candidates = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
  )

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path $candidate)) {
      return $candidate
    }
  }

  throw "git executable was not found. Install git or add it to PATH."
}

$GitExe = Resolve-GitCommand

$repoRoot = (& $GitExe rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0 -or -not $repoRoot) {
  throw "Current directory is not inside a git repository."
}

& $GitExe -C $repoRoot rev-parse --verify --quiet $BaseBranch *> $null
if ($LASTEXITCODE -ne 0) {
  throw "Base branch '$BaseBranch' does not exist."
}

$changesByBranch = @{}

foreach ($branch in $Branches) {
  & $GitExe -C $repoRoot rev-parse --verify --quiet $branch *> $null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[skip] branch not found: $branch"
    continue
  }

  $files = (& $GitExe -C $repoRoot diff --name-only "$BaseBranch...$branch") |
    Where-Object { $_ -and $_.Trim().Length -gt 0 } |
    Sort-Object -Unique

  $changesByBranch[$branch] = $files
  Write-Host "[info] $branch changed files: $($files.Count)"
}

Write-Host ""
Write-Host "Pairwise overlap:"

$branchList = @($changesByBranch.Keys)
if ($branchList.Count -lt 2) {
  Write-Host "Not enough branches found to compare."
  exit 0
}

for ($i = 0; $i -lt $branchList.Count; $i++) {
  for ($j = $i + 1; $j -lt $branchList.Count; $j++) {
    $left = $branchList[$i]
    $right = $branchList[$j]
    $leftFiles = $changesByBranch[$left]
    $rightFiles = $changesByBranch[$right]
    $overlap = $leftFiles | Where-Object { $rightFiles -contains $_ } | Sort-Object -Unique

    if ($overlap.Count -eq 0) {
      Write-Host "[ok]   ${left} vs ${right}: no overlap"
      continue
    }

    Write-Host "[warn] ${left} vs ${right}: $($overlap.Count) overlapping file(s)"
    $overlap | ForEach-Object { Write-Host "       - $_" }
  }
}
