@echo off
setlocal enabledelayedexpansion

:: Automatically run inside CrewFlow-main if running from the parent directory
if exist CrewFlow-main (
    echo [INFO] Detected CrewFlow-main directory. Switching directory...
    cd CrewFlow-main
    echo.
)

title Git Push Automation Tool

echo ===================================================
echo             GIT PUSH AUTOMATION TOOL
echo ===================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git and try again.
    goto end
)

:: Check if .git directory exists
if not exist .git (
    echo [WARNING] No local Git repository detected in the current directory.
    set /p init_choice="Would you like to initialize a Git repository here? (Y/N): "
    if /i "!init_choice!"=="Y" (
        echo Initializing Git repository...
        git init
        git branch -M main
        echo Git repository initialized and default branch set to main.
        echo.
    ) else (
        echo Operation cancelled.
        goto end
    )
)

:: Stage changes
echo [1/3] Staging all changes...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to stage changes.
    goto end
)
echo All changes staged successfully.
echo.

:: Get commit message
echo [2/3] Commit Configuration
set "commit_msg="
set /p commit_msg="Enter commit message (Press Enter for default: 'Update: %date% %time%'): "
if "!commit_msg!"=="" (
    set commit_msg=Update: %date% %time%
)

:: Perform commit
git commit -m "!commit_msg!"
if %errorlevel% neq 0 (
    echo.
    echo [INFO] No changes to commit or commit failed.
    echo.
) else (
    echo Commit successful: "!commit_msg!"
    echo.
)

:: Check remote origin
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] No remote 'origin' configured.
    echo Automatically connecting to the CrewFlow repository...
    git remote add origin git@github.com:aaryanishere/CrewFlow.git
    echo Remote 'origin' added: git@github.com:aaryanishere/CrewFlow.git
    echo.
)

:: Check current branch name
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
if "!current_branch!"=="" set current_branch=main

:: Push changes
echo [3/3] Pushing changes to remote...
echo Branch: !current_branch!
git push -u origin !current_branch!

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. Please check your network connection, remote settings, or permissions.
) else (
    echo.
    echo ===================================================
    echo  SUCCESS: All changes have been committed and pushed!
    echo ===================================================
)

:end
echo.
pause
