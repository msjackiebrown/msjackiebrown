## Transcript

Hi guys, welcome again. In this video, we will integrate with the previous video,

previous code with the stimulant and we will do this project. And here we have a title,

image describer and here we can upload a file, here gpg, gpeg and png files we can upload.

You can change it, I will show you how you define these file types, here, let me click,

we can upload a file here, for example, same image and here we are seeing this image and

at the background or model describe this image and here we can see that type.

When we upload this image, actually there is nothing meaningful here but again,

it describes here. Okay, let's see what's going on in the code. Here again, we can use

Olama and Streamnit and when I tried it first while uploading a photo, an image here,

I got an error, I couldn't upload it. Later I searched and here if we use this version of

Streamnit here 1.24.0, just install this version of Streamnit if you have that problem,

problem will fixed and here I will share this code with you and you can see here.

And here we define title, image describer, to upload, to add this uploading part into Streamnit,

we are using this one, ST, here we are using Streamnit file loader and the first one is choose

an image, here we can see that choose an image, it's a label, if you change it here, the text will

be different and type here, gpg, gpeg, png. So if you define these types, it means that only

these types, that's like Streamnit except. So if you are working with PDF file or other files,

you can add other file types here also. Okay and when we just do that, here we will have this

art and we will print uploaded file. So when we upload a file, let me show you,

upload a file, it looks like this if you print it, id6name, frozen lake dqlpng. So we need to

have this one, the name, we will use name and here also we can take type here, type is image png

and size is this one. And here if upload.file is not none, it means that we already

upload a file, we are printing uploaded file name, here you can see frozen lake dqlpng and

the type of this name is here, Stream. So here I understood that we can directly use

uploaded file.name here in the model. To show this image here, we just use st again image,

upload file, this file and caption uploaded image, here that's text we are seeing here,

upload image and use column width true means that that's image, image length will be a same as

width column. Okay, this is how we show an image on the streamlit page. Also you can,

if you want to show other pages, you can use this image function here. And then this part,

we already know that we are using chat function here model lower, it's be message, role, intent,

and image before it was image.dpg file. So instead of that, we just use upload.file.name

that gives us the name of the file and here this response message and content gives us the

description of this image and with markdown we are writing here that result. I also here printing

this result here we can see that. Okay, let's see this how we do this project. I think it's

my useful and when we make the model describe this kind of chart, it also can understand these numbers

here. Maybe you can try, for example, if there is a mathematical equation,

maybe you also can make describe that mathematical equation. Actually, let's wait a minute,

I will find an image of a equation. Let's see, it's working more or not. Okay guys, I found an

image of a file. Let's see. Image a digital screenshot of a technical drawing,

possible to throw an engineering document or presentation. It shows the detailed

cross-sectional view of the technical component with various level parts and annotations.

Actually, it couldn't say it's an 8-of-oil. So actually, it's not enough to study some images,

this kind of images. Let's see how about the equation. Just take a screenshot from a book here.

We show the piece of paper with text written on it. The text appears to be in German.

No, it's in English. Okay guys, it's not so good, but it's working well with describe and

image or like nature. If there is a man, it's a walking. I think it can describe that kind of things

better, but to study these kinds of mathematical equations, it's not very good. So you can use it

for different tests. Okay guys, if you have any questions, please ask me. See you in the next video. Bye bye.

## Resource
[[9.py]]
