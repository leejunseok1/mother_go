param(
  [string]$MainPath = "C:\Users\dufrl\Documents\노인프로젝트",
  [string]$UiPath = "C:\Users\dufrl\Documents\mother-go-agent-ui",
  [string]$AnalysisPath = "C:\Users\dufrl\Documents\mother-go-agent-analysis",
  [string]$AnswerHistoryPath = "C:\Users\dufrl\Documents\mother-go-agent-answer-history"
)

$ErrorActionPreference = "Stop"

function Assert-PathExists([string]$PathToCheck) {
  if (-not (Test-Path $PathToCheck)) {
    throw "Path not found: $PathToCheck"
  }
}

Assert-PathExists $MainPath
Assert-PathExists $UiPath
Assert-PathExists $AnalysisPath
Assert-PathExists $AnswerHistoryPath

$wt = Get-Command wt -ErrorAction SilentlyContinue
if (-not $wt) {
  throw "Windows Terminal command 'wt' was not found."
}

$args = @(
  "new-tab", "--title", "orchestrator", "-d", $MainPath,
  ";",
  "new-tab", "--title", "agent-a-ui", "-d", $UiPath,
  ";",
  "new-tab", "--title", "agent-b-analysis", "-d", $AnalysisPath,
  ";",
  "new-tab", "--title", "agent-c-answer-history", "-d", $AnswerHistoryPath
)

& $wt.Source @args

Write-Host "Opened 4 terminal tabs:"
Write-Host " - orchestrator: $MainPath"
Write-Host " - agent-a-ui: $UiPath"
Write-Host " - agent-b-analysis: $AnalysisPath"
Write-Host " - agent-c-answer-history: $AnswerHistoryPath"
