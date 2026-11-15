## Transcript

Hello guys, welcome again. In this video we will combine what we have learned in the

previous video and with the simulet and this LLM model. First let me show you here we

have a story. I open it on Gutenberg.org and I copy it all text here as you can see the

very long story. And then here the first sentence we have a information like 1 mL

was sent to result weights manner to live with her uncle. It goes like this. And I copy it here

in text area and my question was where was mLenux sent to? So the answer is this missile

weight manner to live there. When I click on answer we expect that answer this question

correctly. And at background I split into chunks I will show you how to do that. But first I want

to show you. I will answer correctly. Okay here mLenux 1 center missile weight manner

in England where she would live with her uncle Mr. Archibald Kraywan. Here in this sentence

it didn't write there is no name of her uncle. But let me crack it. It's correct or not.

Okay you are going to your uncle. His name is Mr. Archibald Kraywan. Okay. In

this chunks probably there is uncle's name here. So the answer is really quite good. But

maybe you think you can think this question was about first sentence right? So for AI for

model easy to answer this question. Maybe you think you can think like that. But the problem is

here the size of the whole text. And let me show you. I will just change the text here long text.

Later I will explain in detail guys. But first I will show you why we need to use this chunks.

Actually here for this kind of problems using chunks is not better to use. It is we must use to

handle this kind of problems. Now we are asking this question just according to this text,

whole text. And the answer here as you can see there is like unrelieved answer. The

product text is less agreement for project Gutenberg. It goes like this license copyright and

disclaimer. It goes like this because when I copy I just use control A and I copy this part also.

Probably that license part somewhere here I'm not sure. So when the input solve large this kind of

models doesn't work well. But then we chunk and find similarity. We are just giving this three

text. And we are giving the model this short text and s this question. And with this small input,

small size input, a long model works well. This is the logic. So I hope I make you accept we must

use chunks. Not better to use. Okay guys now let's look at the code.

Here before we use this part, Olauma Lampchain from template and this text reader. Now I just

add space because we already download that model. So we don't need to use space CLI again.

Here we are loading the same model. And then title here. Okay we can change title but it's

not important now. And here long text is text area. Pass your long text here. Hide 300.

Here you can change the height of this text area. Here you can see it 300. You make it like 500 it

will be higher. And question another text area here and we have button answer button.

And then I mark down the length of the text here. You can see that in this text, in this story,

we have 147,000 characters.

Okay and then if button if long text is true, we are defining model here and defining the template.

What's template here? You are a helpful assistant. Please answer the following question here.

Based on the below text and text here.

We can make space here. And from templates is here we have two different variables here. Text

and question. And then text reader. We are using this one chunk size 500 chunk over left 150.

Now you know how they are working so you can change them according to your project.

And chunks here we are splitting them. And similarities we have an empty list.

Actually we are doing the similar thing with this previous code. And then smooth score.

Here we are finding similarities. And then we are adding the smooth score and this chunk.

We are taking this chunk as a text by using page content before we use that.

We are saving them as a tuple into a smooth list.

So when this loop finished we will have all the text with chunks and a smooth score in this list.

Now we can reorder this list according to similarities. So reverse true here. And we know that

it's ordered from high similarity to lowest similarity. And here the last part.

3 it's the list guys. So if I use this one it means that I will just this will be a list again.

And I will take the first three items. If I make it 10 this will be a list which has

the first 10 items. And 3 here means I will just use the most similar three chunks.

Not others. Again according to your project you can increase it. For example if you want to

ask like use more chunks just use 10. Okay but be careful if your chunk size is

higher larger. And if your chunk 20s is also higher. For example if you use like 2000 chunks

size and 10 or 20 the whole text will be longer again. So the model can't work very well.

In that station, that condition. Okay now we have ordered a list here and then we are taking

score and sentence and empty. Thanks to we have here and here I am writing these sentences,

these chunks we can say. Here for example I use 3 and here I am seeing 3 chunks. These chunks

are most similar to this question. And for example I should not want to go talking about so

that little Mary it goes like this. And all of them has Mary name and they are this is a

similarity. Okay after that in this loop I am adding these sentence into this text.

So when this loop finished I will have these best 3 chunks in one text. Then I am

changing this model and from template we learned this before. And then to get the answer I am using

chain run because I have two different variables here. I am using a dictionary text.

Here the variable text will be text is one. Question will be question and question is

here. And answer will be answer of the LAMP. And here I am just creating subheader and markdown

answer. Here we have subheader and answer. So now we are just using text and run

to code. So now we expect proper answer.

And also it answered correctly again. If you increase this chunk size

it will take shorter time because I use chunk size 500 and here you can see like for 500 we will

have around 1000 chunks. And because of that just finding the similarity between 1000 chunks

will take around 10 seconds. I showed you before. And after that model also takes time to answer

the question. But if you increase from 502 like 1000 it will take shorter time because you will

have around 500 chunks. Let's see if we get correct answer.

I send to your share specific event to your share which is state.

Okay your share specifically you want to evaluate manner your share.

Yeah the answer is correct. So let's ask this question who is

Mr. Archivalk K1. So we know that he is Mary's uncle.

YK at 시간. affect my share.

صich ok.

Okay.

running.

Okay guys we get answer

Let's see

Fantastic this Dr. Kroen's name. He's not report doctor professional

Kroen

Okay, it's a short answer

Well, I hope you understand the logic guys. Oh, you can improve this project according to your need

For example

Actually, I don't want to do this because it's kind of wasting your time

For example before we learned that like while cheating PDF

In that project we learned that how can we upload PDF and

How can we

Commodity PDF into text file?

So you just copy text that quote from there

So you can just when you upload a

PDF which has story

you can

In this way you will ask this question and

The model will chunk all the text in that PDF and answer your question according to PDF

So if I do that I will just repeat the same code, but you can just take that code

From there and you you you can do it by yourself easily

So in the next video probably we can start a new

The difference project for example taking node project can be so we will have another like with Python

We will do kind of

Taking notes app and

Then we will ask you question in the same logic in same way and

our the module will answer first find the

closest

most similar

Text and answer according answer the question according to those parts

Okay guys if you have any idea or projects for this course you can tell me if I have time

I will add middle projects in this course and I will keep improving

Discourse by adding different projects

Okay, see you in the next video bye bye

## Resources
[[21.py]]