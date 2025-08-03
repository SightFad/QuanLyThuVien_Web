@echo off
echo Starting Library Management System Backend...
echo.
echo Database: Azure SQL Database
echo Connection: dbskidibi.database.windows.net
echo.
cd LibraryBackEnd\LibraryApi
echo Building project...
dotnet build
echo.
echo Starting server...
dotnet run
pause 