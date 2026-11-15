I am expecting to create a Chroma DB database  for each binder so I think Persistent Client is warranted here.  Collections are sections which contain documents. 

Example of file in filesystem: The binder is Name_Binder.

```bash
$ ls -latR
.:
total 48
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 Name_Binder/
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:58 ./
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:58 ../

./Name_Binder:
total 0
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 inputs/
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 ./
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 outputs/
-rw-r--r-- 1 msjac 197609 0 Nov  6 12:59 .chromaDB
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:58 ../

./Name_Binder/inputs:
total 0
drwxr-xr-x 1 msjac 197609 0 Nov  6 13:00 section/
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 ./
-rw-r--r-- 1 msjac 197609 0 Nov  6 12:59 usersdocument1.txt
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 ../

./Name_Binder/inputs/section:
total 0
drwxr-xr-x 1 msjac 197609 0 Nov  6 13:00 ./
-rw-r--r-- 1 msjac 197609 0 Nov  6 13:00 anotherfile.txt
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 ../

./Name_Binder/outputs:
total 0
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 ../
drwxr-xr-x 1 msjac 197609 0 Nov  6 12:59 ./

msjac@DESKTOP-SBLK6D0 UCRT64 ~/Desktop/DEVELOPER'S PLAYGROUND

```

Each time a documented is added as a source, it is ingested in chromaDB and a copy is in input folder.
User is also able to create sections in the binder and that section can have more documents, another  section, etc.

Need to determine how we can do this using Python/Flask backend.