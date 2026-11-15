## Transcript

Hello guys, so welcome again in this video we will learn how to chat with PDF by using

a local large language model.

We also can chat with PDF with like other GPs like OpenAI and other GPs but as I know

there is a limitation.

For example, just in one day we just can chat with like 3 or 5 different PDFs.

But in the tutorial we will learn how to do this with pre-local models.

So when we learn it we can chat as many as we want PDF.

We don't have any limitations.

First let me show you how it works later we will learn the code.

Here we have a button and for example I want to upload this PDF.

This is from my other course it's about a real file, a variation.

It's about key parameters and here I'm explaining what's called line, and for example I don't

want to read all of it.

Here I just want to ask what is, let me make it bigger.

What is code?

And here we have an answer according to text, code line is defined as a distance measure

along the imaginary straight line, code line connected to leading edge and trailing edge

of an a file.

This dimension serves as a reference length for other geometry parameters and that's

correct.

But if we ask and we are making sure this answer from this PDF and it's correct.

And for example we just ask unrelated question like how does Mary feel.

So there is no answer for this question in the PDF.

And here we can see there is no information about a person named Mary or her pre-linked

in the provided text.

The text appears to be about earfails and their geometric parameters, our dynamics and

construction.

Now we can see that it's working well.

Now let's learn how to do this.

Here again we are using stringed olemma as always and we are using OS to save.

And the file we are uploading so we are saving that file in the same directory.

And to read the PDF here you can see that when we upload the PDF we can see the context

of the PDF.

I wanted to show it to you but if you don't want to see what is inside the PDF you can

you don't add this part.

So to read the PDF we are using the PIT library here.

So if you use this library for the first time you should install it and I adhere PIT install

PiMu PDF.

If you install this library you can import this.

Okay this function we are reading the PDF here upload file.

Later we look at this function.

First let's start here.

It's the title here, stringly title chat with PDF.

We know that here we are seeing it with PDF.

Then we are adding a uploader here, it's the uploader.

And the label is upload to your PDF file.

Here we can see it uploads your PDF file.

And type here PDF.

And here I am printing it, so I don't need to print it.

After that if upload file is not none, it means that there will be uploaded when we upload

in file and PDF file we enter this condition.

First we are saving this uploaded file, save upload file is there.

We are going to find out the function, this one.

So we are giving upload file as a parameter here and first we are getting the directory here,

save path and file path.

Actually we use the same code for the image to save image.

I am using the same code.

So here we are just saving this file in the same directory with the Python file.

And after that here we are just writing saved file, this file name to save path.

And because of that we are seeing this one.

Save file 15 PDF to here is our directory.

And my Python file is also in the same directory.

OK, here we save it.

This file then we need to extract text from this PDF and this is the function.

Again we are giving the same file as a parameter.

And we are opening the PDF with its library, it's open this file.

And we are just creating a variable string variable text.

And then we are reading the page in this document.

And we are adding this text into the page, into this text.

When we finish this, we are returning text.

So what we know that now here PDF text is the text in the PDF.

After that here we have a subheader PDF contents.

Here we are seeing its PDF contents.

And then we are writing PDF text here.

We also can write markdown, can use markdown to see better.

OK, let's run again.

1, 5.

OK, it didn't change, but if you are using like the Latx format,

markdown will make it look better.

Here we are writing the text content.

After that we have a prompt here text area is one.

And level is SQL question based on the PDF content.

Here we are seeing it SQL question based on PDF content.

And then we are adding a button here.

OK, button.

Here we have that.

And if button is true, it means that whenever we click on this OK button,

after we are checking the prompt, if prompt is true,

it means that if we wrote something in the prompt in the text area,

then these lines are running.

What's happening here?

We have combined prompt.

What is that based on the following contents?

And here what's all the content PDF text here?

We extract the text from PDF here.

And after that the question is our prompt.

And prompt is what we wrote in the text area.

And this is our combined prompt.

After that we are just taking response with all of my generate.

We know that.

And we are using again, Lama 3.1.

And prompt is combined prompt.

And to get the answer, we are just getting response

and response here from that dictionary.

And we are writing it with markdown.

And this is, let me show you again.

How are you just s this one?

And this one here we are writing it with markdown.

OK guys, I think it's useful.

So if you want to read something, like if you need to study

our PDF, you just upload it here.

And as questions,

if you don't want to see this one, for example,

if you have a long PDF that can be annoying,

you need to scroll a lot to go to the downside.

So just don't here,

it's the markdown PDF text don't run design.

Here we uploaded and PDF content and we don't have now.

So you can ask questions like what is here for you.

Here we have a correct answer.

And what we know that this answer comes from that PDF.

So if you think you don't have to see the PDF,

just don't run this one and this one.

If you want to see it, you can run this too.

Sometimes it can be useful, sometimes it can be annoying,

so you can decide by yourself.

So guys, if you have any questions, please ask me.

See you in the next video.

Bye bye.

## Resources
[[13.py]]