## Transcript

Hello guys, welcome again in the previous video we learned how can we describe an image.

Now I want to make a better project.

Can we make the model describe a video?

As I know for now just Google's Gemini can describe a video you can ask some questions

about video.

We will try to do similar projects for free because we are using free models.

Now we need to understand that.

Okay, first let me show you the video.

Let's say shorts and it's about cooking.

Right to final we want to model describe how it's preparing the food.

Okay, it's about one minute.

Yeah, 56 seconds video.

And we want it to describe what's going on in this video.

First we know that video consists with heads frames.

For example I don't know what is the FPS of this video.

But generally we know that in one second we have 60 frames per second.

If it is like 60, 56 seconds we will have 60 multiplied with 56 frames.

But we don't need to use all frames.

We can call one frame is one image.

So if we extract frames from this video and we will make the model describe each frame

for example we will take one frame per two seconds.

For example at the beginning we will take this frame.

So when it is second to second to second later we will take another frame and then we

will keep them in a list.

And we will make the model describe each of them.

For example if we have like 30 frames and we will make the describe like first frame,

second frame and third frame it goes like this and we will now we will have the description

of all those frames.

And we can use that Lama 2.1 to summary all these frames.

And we just give an explanation.

These are the frames of a video.

I want you to describe what is going on in this video like this.

And then that model gives us a like brief description and that description will be description

of the video.

This is the logic.

So in this video let's learn how can we separate a video into frames.

And I already did that.

Sorry here.

For example the first frame is this one.

The second frame is this one.

And frame is this one.

Let's see the code.

This is what we are using and known as OS here.

And we will use CV2 and it is guys if you didn't use before you need to install it.

Peep install open CV Python.

Just keep install open CV Python later you can use CV2 library.

Then we are defining a function here video to frames and we will give video pads.

Here the video name of the video is video mp4.

And what's going on in this function.

Open the video file.

First we will open this file video with this library here.

Then check if the video was open successfully.

We are checking here.

Then we are getting FPS.

Here FPS is frame per second.

It's also here also you can see that.

And then frame interval int here mp2 is 2 seconds.

For example in your project if you want to take frames per 1 second you can just change

it to 1.

So if you are working with larger videos and maybe you want to take frames from 10 seconds

and you just type here 10.

So you will take the frames from 10 seconds.

And here frame count we will have how many frames we have.

With frame count we will increase it in while true loop here and save frame count 0 also.

And while true we are getting red and frame here.

Read the frame from the video.

And if the frame was not read successfully we will break the loop.

And in this way we don't have an error.

And save the frame if it matched the interval.

And here we need to save these frames.

In this way we can make the model describe this image.

Otherwise if you don't save it you can't give those frames into model.

And here if frame count here percentage makes the frame interval.

For example if this number like 12 and if it is 10 the result will be 2.

So while we are using that here we are making sure that frame we take for 2 seconds.

For example that frame count is increasing in while true these are all frames.

We have many frames here but we don't want all of them.

We want per 2 seconds.

For example the first frame will be 0 seconds at the beginning and the second frame will

be like 100 20 if FPS is 6.

For other frames we don't want to save them.

So here frame interval FPS if it is FPS 60 now frame interval is 120.

And at the beginning frame count when frame count is 0 and 120 will be also 0 so we will

take the first frame.

Then from the first frame to 120 frame we don't take others.

We don't save other frames but we also as extract those frames.

Then when it is 120 we are taking we are saving that frame also.

After that we will we keep accepting these frames.

And when the next frame is 240 frame also we are saving that.

In this way we achieved saving like frames which we want to save not all frames.

Okay.

So constructor file name here we are taking the file name of frame.

For if it is the first frame we will save it 0 as you can see here frame 0.

GPG is the name of the file and then we will save the frame as a GPG file.

With this code we are saving it and we are printing as you can see saved file name.

So save frame 0 GPG file GPG file.

And then save frame count we are adding 1.

At the end we are printing also save frame count 29.

So in this video we have saved 29 frames.

After that we are increasing frame count here in this while loop.

And let's see I want to print this frame count.

Okay let's print it outside of the while loop.

Okay.

Let's see how many frames we have.

Here as you can see the total frames are 1,702 frames we have in that video.

But we just saved 29 frames.

Okay let's then we are saving them.

Here released video capture object with this code and then total frames saved.

We are printing saved frame count from here we are increased in this if condition.

And here we are defining video pads and we are calling this function video to frame.

Frame function and giving this video pads that.

And then in that function we are already saving them.

And in this open form folder let me show you again here we have all these frames as a

GPG file.

But in the next video I will show you actually now if you want you also can do it by yourself.

Actually I want you to force yourself without watching the next video.

How can you use these frames to describe a video?

Later you can watch the next video I will show you how to do that.

But we will use these GPG files first make the model describe each of them one by one.

Then we will use all the descriptions to describe the total the whole video.

Okay guys if you have any questions please ask me see you in the next video.

Bye bye.

## Resources
[[11.py]]