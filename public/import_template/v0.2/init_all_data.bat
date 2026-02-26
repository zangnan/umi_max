@echo off
chcp 65001 > nul

set PATH=%PATH%;C:\xampp\mysql\bin

REM DB info
set db1_ip=192.168.0.194
set db1_name=nbgltest
set db1_user=root
set db1_password=root

REM DB Script
set db1_sql_file=init_data.sql
set db2_sql_file=init_data_media.sql

REM init sql
echo init data script: "%db1_sql_file%"
mysql -h %db1_ip% -u %db1_user% -p%db1_password% %db1_name% < "%db1_sql_file%"
if %errorlevel% neq 0 (
    echo init data script: "%db1_sql_file%" error
    pause
    exit /b
)

REM init sql
echo init data script:"%db2_sql_file%"
mysql -h %db1_ip% -u %db1_user% -p%db1_password% %db1_name% < "%db2_sql_file%"
if %errorlevel% neq 0 (
    echo init data script: "%db2_sql_file%" error
    pause
    exit /b
)

echo scuuess ~~
pause