# PowerShell script to create a scheduled task for daily schedule updates
# Run this script as Administrator

# Configuration
$TaskName = "ISSATSO-Schedule-Update"
$ScriptPath = Join-Path $PSScriptRoot "update_schedules.py"
$VenvPath = Join-Path $PSScriptRoot ".venv"
$VenvPythonPath = Join-Path $VenvPath "Scripts\python.exe"
$WorkingDirectory = $PSScriptRoot
$LogPath = Join-Path $PSScriptRoot "logs"

# Check if virtual environment exists
if (Test-Path $VenvPythonPath) {
    $PythonPath = $VenvPythonPath
    Write-Host "Using virtual environment Python: $PythonPath" -ForegroundColor Cyan
} else {
    $PythonPath = (Get-Command python).Path
    Write-Host "Virtual environment not found, using system Python: $PythonPath" -ForegroundColor Yellow
    Write-Host "To create a virtual environment, run: python -m venv .venv" -ForegroundColor Yellow
}

# Create logs directory if it doesn't exist
if (-not (Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath | Out-Null
    Write-Host "Created logs directory: $LogPath" -ForegroundColor Green
}

# Define the action (what to run)
$Action = New-ScheduledTaskAction `
    -Execute $PythonPath `
    -Argument "`"$ScriptPath`"" `
    -WorkingDirectory $WorkingDirectory

# Define the trigger (when to run) - Daily at 7 PM
$Trigger = New-ScheduledTaskTrigger -Daily -At "19:00"

# Define settings
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1)

# Define principal (run whether user is logged on or not)
$Principal = New-ScheduledTaskPrincipal `
    -UserId "$env:USERDOMAIN\$env:USERNAME" `
    -LogonType S4U `
    -RunLevel Limited

# Check if task already exists
$ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($ExistingTask) {
    Write-Host "Task '$TaskName' already exists. Updating..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Register the scheduled task
try {
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $Action `
        -Trigger $Trigger `
        -Settings $Settings `
        -Principal $Principal `
        -Description "Daily schedule update for ISSATSO at 7 PM" `
        -ErrorAction Stop
    
    Write-Host "`n✓ Scheduled task created successfully!" -ForegroundColor Green
    Write-Host "`nTask Details:" -ForegroundColor Cyan
    Write-Host "  Name: $TaskName"
    Write-Host "  Schedule: Daily at 7:00 PM"
    Write-Host "  Script: $ScriptPath"
    Write-Host "  Python: $PythonPath"
    Write-Host "  Logs: $LogPath"
    
    Write-Host "`nTo test the task immediately, run:" -ForegroundColor Yellow
    Write-Host "  Start-ScheduledTask -TaskName '$TaskName'" -ForegroundColor White
    
    Write-Host "`nTo view task status:" -ForegroundColor Yellow
    Write-Host "  Get-ScheduledTask -TaskName '$TaskName' | Get-ScheduledTaskInfo" -ForegroundColor White
    
    Write-Host "`nTo remove the task:" -ForegroundColor Yellow
    Write-Host "  Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false" -ForegroundColor White
    
} catch {
    Write-Host "`n✗ Failed to create scheduled task:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
