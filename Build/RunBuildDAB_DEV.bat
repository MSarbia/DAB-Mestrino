FOR /d /r ../.. %%d IN (SimaticITPackages bin) DO @IF EXIST %%d rd /s /q %%d

"C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe" BuildDAB_DEV.build /p:Verbosity=Diagnostic /p:BuildingInsideVisualStudio=False 
rem > .\build_proj.log
rem notepad.exe .\build_proj.log

pause