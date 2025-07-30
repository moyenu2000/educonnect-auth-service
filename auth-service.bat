@echo off
for /f "tokens=* delims=" %%i in (.env) do (
    for /f "tokens=1,2 delims==" %%a in ("%%i") do (
        set "%%a=%%b"
    )
)
cd auth
call mvnw.cmd spring-boot:run