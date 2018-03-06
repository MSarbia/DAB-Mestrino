@echo off
echo Cleaning
set count=0
set folderPath="%~1SimaticITPackages\"
echo %folderPath%
:loop
if %count% GTR 0 if EXIST %folderPath% echo Retry: %count%
if EXIST %folderPath%  RD /S /Q  %folderPath% || echo Error:
if %ERRORLEVEL% GTR 0 echo %ERRORLEVEL%
set /a count +=1
if %ERRORLEVEL% EQU 0 if EXIST %folderPath% if %count% LEQ 100 goto loop
if EXIST %folderPath% if %count% LEQ 10 goto loop
echo Done
