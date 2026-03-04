param(
  [string]$BaseBranch = "main",
  [string]$ProjectTag = "deundeun",
  [string]$ParentDir = ".."
)

$ErrorActionPreference = "Stop"

function Assert-GitAvailable {
  $gitCmd = Get-Command git -ErrorAction SilentlyContinue
  if (-not $gitCmd) {
    throw "git is not available in PATH. Install git or run this script in a shell where git is available."
  }
}

function Assert-ExitCode([string]$Message) {
  if ($LASTEXITCODE -ne 0) {
    throw $Message
  }
}

Assert-GitAvailable

$repoRoot = (& git rev-parse --show-toplevel).Trim()
Assert-ExitCode "Could not resolve git repository root."

if (-not $repoRoot) {
  throw "Could not resolve git repository root."
}

& git -C $repoRoot rev-parse --verify --quiet $BaseBranch *> $null
if ($LASTEXITCODE -ne 0) {
  throw "Base branch '$BaseBranch' was not found locally. Fetch or create it first."
}

$resolvedParent = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $ParentDir))
if (-not (Test-Path $resolvedParent)) {
  New-Item -ItemType Directory -Path $resolvedParent | Out-Null
}

$targets = @(
  @{
    Name = "Agent A (UI)"
    Branch = "parallel/agent-a-ui"
    Folder = "$ProjectTag-agent-ui"
  },
  @{
    Name = "Agent B (Analysis)"
    Branch = "parallel/agent-b-analysis"
    Folder = "$ProjectTag-agent-analysis"
  },
  @{
    Name = "Agent C (Answer/History)"
    Branch = "parallel/agent-c-answer-history"
    Folder = "$ProjectTag-agent-answer-history"
  }
)

Write-Host "Repository: $repoRoot"
Write-Host "Base branch: $BaseBranch"
Write-Host "Parent dir: $resolvedParent"
Write-Host ""

foreach ($target in $targets) {
  $path = Join-Path $resolvedParent $target.Folder
  $branch = $target.Branch

  if (Test-Path $path) {
    Write-Host "[skip] $($target.Name): folder already exists at $path"
    continue
  }

  & git -C $repoRoot rev-parse --verify --quiet "refs/heads/$branch" *> $null
  $branchExists = ($LASTEXITCODE -eq 0)

  if ($branchExists) {
    & git -C $repoRoot worktree add $path $branch
    Assert-ExitCode "Failed to create worktree for existing branch '$branch'."
  } else {
    & git -C $repoRoot worktree add -b $branch $path $BaseBranch
    Assert-ExitCode "Failed to create worktree and branch '$branch' from '$BaseBranch'."
  }

  Write-Host "[ok]   $($target.Name): $path ($branch)"
}

Write-Host ""
Write-Host "Worktree status:"
& git -C $repoRoot worktree list
Assert-ExitCode "Failed to list worktrees."
Write-Host ""
Write-Host "Next steps:"
Write-Host "1) Open 4 sessions (orchestrator + 3 agents)."
Write-Host "2) Paste prompts from .\ops\parallel\prompts\."
Write-Host "3) Use .\ops\parallel\check-overlap.ps1 to detect collisions early."
