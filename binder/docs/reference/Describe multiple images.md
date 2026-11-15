## Transcript

Hello guys, welcome again in this video we will learn how can we upload several

video, several image from different directory and make the model describe each of them.

Here let me show for example I'm now in the downloads folder and I will choose

several image here and many image around 10. When I upload all of them here

this is the first image and this is the description of this image. This one is a

second image and here we have the description of this one. The third image,

description of it, part image, fifth image and here we have all these image and

description, all of them. And so let's see how can we do it. Here first we need

to save this file because to make the model describe the image you remember

that we just use the name of the file. Actually here it's not just the name of

the file. It is the path of the file. So before that image,

GPEG file and this Python file at the same folder. So we just use the name of

the file. But if you want to upload from other

files from other folders, other directories, you need to save them. You need to

save those files in the same director and in this function we are doing that.

Say upload file, function here and we will give upload file and then we will use

also library here, save path, all sketch here, CW, C and we will save at this path

here we are getting the current working director, the same director with this

Python file. And then we will create full path for the file. So to do that we are

using say path here and the upload file name, name of the file and then we are

writing this file, saving this file by using this code. And then we are returning

this ST success save file, upload file name, we are printing file name and file path here.

So we are seeing that when we save the file, here you are seeing that the file,

this is the name of the file, this one, this is the directory of this file. And here we are doing that.

Okay, we just add this function, then other things, actually here we have a

difference to upload several files, we need to add this parameter here except

multiple files true. And when we make it true, now this upload file is at least

not just upload a lot of file. So when we print it here let me show you and be

we upload minute files. Okay, let me upload two files, just two files and show you.

Okay, here when we print uploaded files, here as you can see it's the list and in that list

we have two items and each item is uploaded file. So because of that we are changing this condition,

then uploaded files not zero, it means that at least we uploaded one file. So we are using here for

group, uploaded file in uploaded files, then we are getting uploaded file and uploaded file name here.

The save uploaded file name file here is a name of the function and we are giving uploaded file

from here and then it will return this one. So when we run this code we are printing this

success and we are saving this file at the same directory. Okay, after that we are printing

uploaded file name again and the type of it and this one is same and here we are it's also same,

we are just using uploaded file name and now because we saved it before we are making sure this

file and this Python file at the same directory because of that we can just use the name of the file.

Don't need to find the path of the file. Okay, and just we are printing by using Macdown and as a

result we have this one. If we upload two images we are seeing the first image and description of

the first image, second image and description of the second image. Okay guys, I hope you like this

project also. If you have any questions please ask me, see you in the next video. Bye bye.

## Resources 
[[10.py]]