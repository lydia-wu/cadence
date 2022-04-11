: <<<<<<< HEAD
:: Created 2022-04-06 3P ET, L. Wu
:: Note: User must change ALL file paths below to match personal GitHub Repo location
: SET CadenceGithubFilePath = C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing

@echo off
title Cadence TOP LEVEL Batch File v1.0
echo Welcome to batch scripting.
pause 

:: Generate our files
echo We will now generate files.
start "Data Simulator!" C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\sim_v1_0.bat
pause

echo We will now connect to client.
start "Client! test1"         C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\client_v1_1_1st.bat
start "Client! test2"         C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\client_v1_1_2nd.bat
start "Client! test3"         C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\client_v1_1_3rd.bat
start "Client! test4"         C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\client_v1_1_4th.bat
start "Client! test5"         C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\client_v1_1_5th.bat
pause

:: Move our files
echo We will now email files.
start "Email Flow!"     C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\emailFlow_v1_0.bat
pause

:: Clean our files
echo We will now clean ingested files.
start "Unzip!"                              C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\unzip_v1_0.bat
start "Customer LookupTable!"               C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\customerLookup_v1_0.bat
start "Cadence Data Generator LookupTable!" C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\generatorLookup_v1_0.bat
start "Log Filtering!"                      C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\logFilter_v1_0.bat
start "Archiving Files older than 1 Day!"   C:\Users\lydia\GitHubLocal\cadence\Top_Level_Processing\archive_v1_0.bat
pause

echo Now exiting Cadence Batch File