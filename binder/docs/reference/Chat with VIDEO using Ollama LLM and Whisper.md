## Transcript

Hello guys welcome again in the previous video we learned how to ask questions for the PDF

and we will ask questions to LLM and LLM answer our question according to PDF.

In this video we will learn for example we have a video but not like the previous video.

We learned for example if we have just a video without audio without speech.

What we are doing we are taking frames and with LLM we can learn what's going on in that frame, in that image.

But now we just consider we have a video and somebody is talking and teaching something.

So how can we ask a question with that video without watching whole video.

As I know there is some tools we can ask questions to a YouTube video.

But as I know that tools just extract the subtitles from video and according to that

we can answer that question.

But now we don't we have a video without subtitles.

And when we upload first we will extract audio from the video then we will

convert that audio into text file, transcribe it, here you can see it and then when we ask a question

here I upload it at the third video in this course and I explain I introduced a streamlit library.

Here as you can see I told many things but if you just want to learn what is streamlit

I hasty1 and here is the answer according to the content streamlit is a library that allows you

to create simple web based applications with Python. That's correct.

Particularly useful for creating interactive websites and dashboards.

The creator of the video describes it as really simple and useful.

I remember I said that.

If you just know Python and want to do a website making it an attractive option for data scientists

and developers who want to visualize the work and create user friendly interface without needing

extensive web development knowledge. I don't remember what I said exactly but

based on the knowledge in the text this model

answer my question and explain what streamlit is very well.

Instead of reading these text or watching video if you just want to learn what streamlit you can ask

here and you can learn it and you can do it for other videos.

I don't want to show you again as here I just for example

let me show you.

Here when we upload a video here we are using whisper to describe that audio and it will take

time so I don't want to waste your time.

But here in some like around one minute it will describe it and we can ask questions.

So let's see the quote here.

We are using other libraries and streamlit OS and Olaoma we used before.

Now we will use whisper and it's created by OpenAI.

Here while if you don't use didn't use before whisper you should install it by using OpenAI

dash whisper. Pipe install OpenAI whisper you should write.

Time file. I say here I want to show you how to save. We are loading your file right.

If you want to save that file as a temporary file here time comes from temporary.

We can use time file library. I will show you how it works here.

And we are using cv2 actually it comes from OpenCvPitent so if we don't use before

we just install it. People install OpenCvDashPitent and we are using Nampai but

first you just try to install Nampai like people install Nampai but you can have a

complete with other library like Numbai. So to fix that problem you should install

1.22.0 version here I edit this one you can try this.

And here we are using Hideup from Hideup we are importing audio.

Second I will show you where we are using them and we are using Olamma of course.

And for whisper guys we are loading model and it's free and really successful.

I suggest you to use whisper here. We have five different models. Tiny is the smallest one.

For example if you use tiny it will transcribe a pasteur but the accuracy will be lower

and paste and the size of the model is also increasing. For example now I am using medium

and the size of the medium model is 1.42 Gb.

Before I used base, base was about 140 megabytes but with base model for example in that video

I was using like streamlets but it couldn't understand streamlets. It was writing stream,

K and IT. So this kind of special character, special words it couldn't understand very well.

I realized that this medium model better understand better but it works slower. For example with base

I can transcribe like 7 minutes video around like 5 to 10 seconds

but with medium it exists 1 minutes. So if it is more important for you you should try time and

base but if accuracy is more important for you just try medium and large. I am not sure

size of large but you can try. Okay this is how we load the whisper model.

And then here we are saving the model and we have two functions here. First let's come here.

Again we have a title here video to text and question answer with a lamp here we are seeing it

and then we are putting uploader upload your video file and type will be np4 here we are seeing it

and then and let me upload a video and background

just let him transcribe and later I will show you again.

Here we are checking if upload file is not none. It means that we uploaded a file we are entering

here. First we are here audio file path save uploaded video. This is the name of the function

save uploaded video and we are giving this uploaded file the parameter and what's happening here.

We are creating a path temperature at temporary video path is temp file here we import that's

library name temporary file delete false suffix np4 because we are uploading np4 file and dot name

here we create that path and then we are opening this temporary video path with wv

this one we used before and here we are writing on this path uploaded file this is it comes here

and we are using read method and then here we create a temporary file and here we are

extracting audio from this video by using pidup here we used from pidup import audio segment

and audio path will be here temp temporary video path we create here replace np4 to wow

so that was we uploaded np4 video we are

commuting np4 to wow file and then here video will be out segment audio segment here we are

imported from file this and then we are using video export audio path we created format wow

and then return audio path this is when we run this code this audio path is the like path for audio

file and then we come here again now we know that this audio file path is a path for audio file

so whether we are using it here we have another function transcribe audio and we are giving this path

is a parameter here and let's look at this one transcribe audio audio path and results

here model what was model we defined the model and load model for the first time for example if you

are loading a model first time you should wait while installing it but later you don't need to wait

just you can use it automatically here model transcribe and then audio path

to get the result the text here we are returning result text now we know that this transcribe text is

the text extract from the video after that we are adding sub header here transcribe text here we

are seeing it okay guys transcribe transcribe text here and then we are writing transcribe text

here you can see that and then we are adding the text area for prompt they will ask a question based

on the transcribe text here you can see that and button get answer we have get answer button

and then if button is true and if prompt is true let's make it true like again what is it

just as a general question what is it about

okay one way is this question now bottom up time true and we have we are creating a combined prompt

here based on the following content what's the following content is the text we get from the video

and it is transcribed text you we get that and then a question is the prompt we get from the text

area and we are giving this prompt to a llama tree point one model as a prompt and then we are

writing as a markdown by using response response and this part is same

okay and guys I realize that when we use this medium larger model for whisper it also make

this llama model also slower let me show you here as you can see it's already took around one

minutes maybe it should answer this question quicker

okay let's wait it a while a later I will show you I already download this base model

the speed changing

okay I house here when it finished I will continue again okay guys it answered

the content appears to be a tutorial or instructional video on how to create a simple web application

using stringed python library for building web applications and answer is really good

okay but you realize that it's so slow stop it can be annoying and let's use base model for this

and other things are all same I will upload the same video the third video

before transcribing is also taking around one minutes now it should be faster

here as you can see around five to ten seconds but let me show you here

it couldn't understand three minutes it's writing stream needs again so

for example if you are a speaker the video you want to transcribe doesn't have this kind of

like specific words you can use this one but because other normal words it can understand very well

like hello guys welcome again in this video we will learn how to do a very simple stream lead project

and the whole sentence is really good here we have a title

olemah here olemah is also a facial word so it couldn't understand that and we have a text earlier here

and the button and we will have a level for example but generally it's better

so let's ask the same question what is it about before answering question it is also taking

around one minute now I realize that answer question is also

taking 40 times

here again five to ten seconds this is about creating a simple application using our stream

here with the answer is lama 2.1 model can understood from this stream needs to stream leads

that's really good using AI like sense in the way

if a python library for building your applications the creator demonstrates how to create a title

text input field and button using stream leads syntax here est title est text input est button

and shows how to integrate it with a machine learning model to display the output in real time

when the user interacts with the application yeah that's quite good guys here the model itself also

correct these mistakes and because of that using smaller models for whisper library makes more sense

okay but you can't try for others for example if accuracy is so critical for you just try larger

models like medium or large I didn't try large but if you use larger models it also

needs higher like quality machines like if you have good GPU then you can try this larger model

otherwise it can be take a longer time guys I hope you enjoyed and learned a lot from this

video also I'm trying to teach the basics and I'm just trying to give you idea what can we do

with these local models of course you can improve this video for example you can add like upload

these videos as a list and then you can put a for a while and excite all the text from video one by

and you can get get them together and ask a question too like five or ten different videos so

you can do whatever you want but I just want to show you we also can do such projects

okay see you in the next video bye bye if you have any question guys please ask me bye bye

## Resources
[[14.py]]
