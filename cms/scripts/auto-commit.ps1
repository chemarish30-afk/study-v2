# Auto-commit script for PowerShell
# Monitors file changes and automatically commits and pushes

$commitMessages = @(
    "feat: add new feature",
    "fix: resolve issue", 
    "docs: update documentation",
    "style: improve formatting",
    "refactor: restructure code",
    "perf: optimize performance",
    "test: add tests",
    "chore: update dependencies",
    "build: configure build system",
    "ci: update CI configuration"
)

$excludedPatterns = @(
    "node_modules",
    ".git",
    ".next", 
    "strapi/.tmp",
    "strapi/build",
    "strapi/dist",
    "strapi/exports",
    "strapi/.cache",
    ".env",
    "*.log"
)

function Get-RandomCommitMessage {
    return $commitMessages | Get-Random
}

function Test-IsExcluded {
    param($filePath)
    
    foreach ($pattern in $excludedPatterns) {
        if ($pattern -like "*") {
            $regex = $pattern -replace '\*', '.*'
            if ($filePath -match $regex) {
                return $true
            }
        } elseif ($filePath -like "*$pattern*") {
            return $true
        }
    }
    return $false
}

function Get-ChangedFiles {
    try {
        $status = git status --porcelain
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Not a git repository or git not available" -ForegroundColor Yellow
            return @()
        }
        
        $files = $status | ForEach-Object {
            if ($_ -match '^\s*\w+\s+(.+)$') {
                $_.Substring(3).Trim()
            }
        } | Where-Object { $_ -and -not (Test-IsExcluded $_) }
        
        return $files
    } catch {
        Write-Host "Error getting changed files: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

function Commit-AndPush {
    try {
        $changedFiles = Get-ChangedFiles
        
        if ($changedFiles.Count -eq 0) {
            Write-Host "📝 No changes to commit" -ForegroundColor Yellow
            return
        }
        
        Write-Host "📝 Found $($changedFiles.Count) changed files:" -ForegroundColor Cyan
        $changedFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
        
        # Add all changes
        git add .
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Error adding files to git" -ForegroundColor Red
            return
        }
        
        # Check if there are staged changes
        $stagedChanges = git diff --cached --name-only
        if ($stagedChanges) {
            $commitMessage = Get-RandomCommitMessage
            Write-Host "💾 Committing with message: `"$commitMessage`"" -ForegroundColor Green
            
            git commit -m $commitMessage
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Error committing changes" -ForegroundColor Red
                return
            }
            
            Write-Host "🚀 Pushing to remote..." -ForegroundColor Blue
            git push
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Error pushing to remote" -ForegroundColor Red
                return
            }
            
            Write-Host "✅ Changes committed and pushed successfully!" -ForegroundColor Green
        } else {
            Write-Host "📝 No staged changes to commit" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ Error during commit/push: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Watch-ForChanges {
    Write-Host "👀 Watching for file changes..." -ForegroundColor Cyan
    Write-Host "📁 Monitoring directory: $(Get-Location)" -ForegroundColor Cyan
    Write-Host "⏹️  Press Ctrl+C to stop" -ForegroundColor Yellow
    
    $timeout = $null
    
    # Create a file system watcher
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = Get-Location
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true
    
    # Register event handler
    Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {
        $filePath = $Event.SourceEventArgs.FullPath
        $fileName = Split-Path $filePath -Leaf
        
        # Check if file should be excluded
        $isExcluded = $false
        foreach ($pattern in $excludedPatterns) {
            if ($filePath -like "*$pattern*") {
                $isExcluded = $true
                break
            }
        }
        
        if (-not $isExcluded) {
            Write-Host "📝 File changed: $fileName" -ForegroundColor Yellow
            
            # Debounce: wait 2 seconds after last change
            if ($timeout) {
                Stop-Job $timeout -ErrorAction SilentlyContinue
            }
            
            $timeout = Start-Job -ScriptBlock {
                Start-Sleep -Seconds 2
                & $using:Commit-AndPush
            }
        }
    }
    
    # Keep the script running
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        $watcher.Dispose()
        if ($timeout) {
            Stop-Job $timeout -ErrorAction SilentlyContinue
        }
    }
}

# Main execution
Write-Host "🤖 Auto-commit script started" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Initial commit if there are changes
Commit-AndPush

# Start watching for changes
Watch-ForChanges
