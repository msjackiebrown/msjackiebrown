## Transcript

Hello guys, welcome again. I completed the project. First let me show you how it looks like.

Here we just upload the video in the same way. We upload the image.

And here each frame we are seeing. And I make the model explain with one sentence.

Here this one the second frame and this explanation description of this image.

So the image shows a whole chicken thing on a wooden cutting board.

Yeah, it's not correct. Oh, here you understood. Actually it looks like a whole chicken.

But these models are not so good, but in the future we will have better and better models.

Here we have yogurts. White food is being lifted out of bowl.

Yeah, we have some problems here.

So the string, a bowl of food with close up revealing a sauce being prepared.

Yeah, it understands its sauce.

Glory picture of a person mixing ingredients in a bowl. Yeah, some kind of correct.

You show the person in a process of a marinating chicken pieces. Yeah, it's described correctly.

So there is a pile of green that is on a wooden cutting board. That's correct.

Green foods. Yeah, chopping green foods. Okay.

And it will describe all frames with one sentences.

Then I will make another model with write an explanation what's going on in this video.

The description of the video here. The video appears to be a montage scene showcasing the preparation and serving of various dishes.

Primely chicken based meals in the kitchen setting. The kind of parade.

The video starts with a close up shots of wooden cutting board.

A desperate which sets the scene for food preparation.

The next few frames show a whole chicken that is not correct being prepared on the same surface followed by shots of ingredients being mixed and marinated.

As the video progresses, it cuts the shots and vegetables.

Yeah, here actually the explanation is maybe 70% correct because Lava couldn't understand the first frames correctly.

And then we later we give these descriptions sentences and by using the sentences that Lava 3.1 write this explanation.

So if these descriptions are not correct, this explanation also of course is not correct.

Okay guys, what I think is useful.

So if you if we have better models to describe images, we will have better results.

Now let's see how we do that in the code.

Here I integrate the previous code into a streamnet and we are using these libraries here, cv, openCv, python, allama, streamnet and OS.

Here in this function actually I didn't change anything in video to frames.

And I'm just adding this here, they are defining file name right frame 0 frame 1 frame 2 it goes like this.

And whenever I create a new frame and say that frame, I am adding this file name into frames list.

Here I created frames list and I'm calling that video to frame function here.

So in that function when we call that function all the name of the frames enter we are saving that in the frames list and then we are using it.

So we didn't I didn't change anything here in this function.

And of course if we upload a video from other directory we need to save that video in the same directory with the python file.

So I keep it, keep this one.

Again I didn't change anything here.

In the previous video we use this function to save images in the same directory.

I hope all of you remember that.

And then here we have a title, video disc, and then upload file here.

I deleted that like puller like multiple file true.

So we just want to describe just one video.

So now it is not a list, upload file is not a list here, it's just one file.

So here we can use that if uploaded file is not none.

First here we are making sure we uploaded a file, then whenever we upload file we are saving that file into same directory by using save uploaded file function here.

Then we are printing upload file name and upload file name here type of it.

And then we are creating empty list frames.

After that video path here, upload file name because we saved this video at the same directory.

So for video path we just can give the name of the video.

So when we get video path we are giving this name of the video as video path into video to frames.

Function here in this function.

And after that in this function we already learned that we are separating into frames that video and we are appending those frames into frames list in this list here.

And then we have a description here at first it's an empty screen and we have for loop here for I in frames.

Also we can save for frame in frames.

And here I in each loop it is the name of the frame.

So in the first loop it is frame 0, then frame 1, frame 2 it goes like this.

And then we are showing this image on the stream it.

But maybe some of you think that it looks so crowded here.

If you just want to upload a video and just want to see the description of the video, not all these frames.

Just make current here and then we are this I is the name of the frame.

So we are using I here and describe the image with one sentence because of that because of this content.

The description is one sentence.

If you just write describe the image it will be longer description.

So you can change it and try to get better results.

So if you use like describe the image maybe it will be longer and in this way it can describe it correctly more correctly.

And then the final explanation also will be better.

You can try it by yourself.

But here I want to have just one sentence.

And here to get results here I am showing that it is the Mac Tower response message content.

This is the description below.

So if you don't want to see that again and again, come on this code.

And here we have an empty stream and then this one is a description of that image.

And we are adding these descriptions here.

And I am printing also response.

Here you can see all these descriptions.

The second one is the command.

When this for loop finished we will have in this description we will have description of all the frames.

And they are they look like this way.

For example, this description of the first image is this one, second image is this one, third image is this one.

It goes like this.

Okay, we have the description of all frames.

Then I am creating another prompt here.

Write a general explanation about what is going on in the video.

I am using the following descriptions of the frames of the video.

You can also make this prompt better.

And then I give these descriptions here in the prompt.

And I used Lama 3.1 and here I used generate not chats function.

We used before this one.

All of my generates the model 3.1, Lama 3.1 and prompt is prompt.

So if we use generate and to get the answer we are using response here.

And also to understand this is the description of the video.

First I am just a mic down, this description of the video here we are seeing that.

The description of the video and then this is the result of this Lama 2.1.

And here we don't show this tour.

Let me show you how it looks like.

New the page.

Here we need to wait a while.

I am not sure how long it takes.

Because I just take 1 samples.

It took around 30 seconds for 1 minute video.

I think it takes enough.

We just upload the video and then here we have an explanation.

It appears to be a behind the scenes look at cheap cook preparing and first dishes in the kitchen.

First frame show preparation work such as vegetables, dizzling fruit and setting up a wooden table with a glass top.

As the video progresses we see the chef handling raw chicken and preparing it for cooking,

which I guess that the main focus of the video is on grilled meats, particularly chicken.

This is confirmed by the friend showing the chef grilling, chicken and fish.

But there is no fish in that video.

We still have similar problems.

I will answer more to the layered piece of meat.

In addition to grilled and cooking the video also show the green-wrapped sides, such as the green vegetables.

Some parts are correct, some parts are not correct.

But as I said before, if we have better models we will get better results.

But I think this is a good project.

As I know, now just for Google's Gemini, with Google's Gemini we can chat with video or we describe a video.

But you need to pay for that.

It's not as good as that one.

But in a amateur way we have a pretty video describer.

I hope you like it.

The advantage of this project is that when we have better models like Lava,

in the next days, next month they will publish Lava 2, Lava 3 better models.

And then we will get better results.

This is the main advantage of using these three models.

We are actually pretty. We can use whatever we want.

If you have any questions, please ask me.

See you in the next video. Bye bye.

## Resources
[[12.py]]