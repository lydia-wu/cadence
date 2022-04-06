:: Created 2022-04-06 3P ET, L. Wu
:: Note: User must change file path below to match personal GitHub Repo location
SET CadenceGithubFilePath = C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\

@echo off
title Cadence TOP LEVEL Batch File v1.0
echo Welcome to batch scripting.
pause 

:: Generate our files
echo We will now generate files.
start "Data Simulator!" %CadenceGithubFilePath%sim_v1_0.bat
start "Client!"         %CadenceGithubFilePath%client_v1_0.bat
pause

:: Move our files
::echo We will now email files.
::start "Email Flow!"     %CadenceGithubFilePath%emailFlow_v1_0.bat
::pause
::
:::: Clean our files
::echo We will now clean ingested files.
::start "Unzip!"                              %CadenceGithubFilePath%unzip_v1_0.bat
::start "Customer LookupTable!"               %CadenceGithubFilePath%customerLookup_v1_0.bat
::start "Cadence Data Generator LookupTable!" %CadenceGithubFilePath%generatorLookup_v1_0.bat
::start "Log Filtering!"                      %CadenceGithubFilePath%logFilter_v1_0.bat
::start "Archiving Files older than 1 Day!"   %CadenceGithubFilePath%archive_v1_0.bat
::pause
::
::echo Now exiting Cadence Batch File
pause