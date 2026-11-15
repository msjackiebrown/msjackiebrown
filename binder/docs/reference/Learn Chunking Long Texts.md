## Transcript

Hello guys, welcome again.

In this video we will learn what's shocking, but before that guys I want to explain our

roadmap because I don't want to teach you all the functions and methods in the chain library

because it's kind of teaching you grammar without teaching you sentences like, for example,

if you are learning any language like English, Spanish or other languages.

For me it's always boring without meaning because I want to say it's so what.

Because of that I found the project, so to do that project we will have to learn some

methods and functions from the chain.

This is the project.

For example, I think all of you know that there are some kind of YouTube channels, there

are always talking about the characters in a lot of the links from talking books.

So you will try to create an AI or model.

For example, we will ask a question about Gandalf.

In that model, as fast as possible, if faster is important here, we will check all the books

and then you ask an answer.

But according until now we learned, okay, if you have a text, it's easy to ask a question

about our test.

For example, here I have a test.

So I can ask summarize this text, but the problem is if we have a text like 1,000, 10,000

pages and if we want the model directly to summarize or ask a question about it, probably

if your computer is not good, probably you can't do it.

Even if you have a powerful computer, it will take a longer time.

Where is chunking is important.

At first, we will learn how to chunk a long text, then we will learn how to vectorize

a text.

Also we call it tokenize.

Actually, for a model for a computer, we are reading these letters, but each of these

like words are numbers or vectors for the model.

And our target is to do this project.

First we will learn how to chunk, how to split the long text, like 1,000 pages into like

1,000 characters.

We will have like 1,000 chanx, then we will convert this text into vectors.

After that, when we ask a question, our question will be also vector and then we will find

closest vectors.

This is how transformers architecture works.

Actually, I will explain, don't worry if you are confused now.

So when we, the idea is, when we ask a question, for example about Gandalf, model, don't look

at whole books or all page.

It will find, for example, we will define that, for example, 10 closest vectors.

And we know that that vectors are text like this.

So that 10 closest vectors means that we will get 10 closest like 10, 10 closest text.

So we will almost make sure that in those text, we have just information about Gandalf.

So instead of looking all the page, we will just look at 10 or 20.

And because of that, model, you ask answer, answer we want is quick as possible.

This is the idea guys.

So we will try to do that.

I think if you know the point of what we want to achieve, it will make you motivated

while learning through this course.

Okay, I hope you liked the idea.

But because of the corporate issues, probably I can't do it.

I can't use talking books, but for your personal use, you can do it by yourself.

But I will teach you how to do it.

Don't worry.

Okay, now let's learn how to chunk a long text here.

Let's look at the code first.

To do that, guys, we will use this function, recursive character text separator.

And you will import it from length chain text, and we just simply to text by using this function.

This part is same.

Here we have long text and text earlier.

And then button and long text.

So we are defining model here and template.

You are a helpful assistant, please summarize the following text.

And text we are giving is a variable here and provide a concise summary.

It is our template.

And then here we are creating a prompt template by using prompt template.

We know that.

But here we are creating text separator by using recursive character text separator.

Here we have two different parameters and size, means that how many characters are

in one chunk.

And chunk overlap is here, I want to show you that here when we define text separator,

we are creating chunks by using this text separator, create documents.

And then in that here, as a parameter, we are giving long text.

What is long text here?

What we write in the text area?

Okay, after that I mark down the chunks to show you there.

After that, here we have a list summary.

And we have four loops because in chunks, we have many chunks, many different chunks,

which has around 500 characters.

And then here I am writing chunk page content.

Here I will show you where this page content comes.

For example, I have this text here when I click on summarize.

This part is here, chunks.

We are writing chunks here.

And it's the list which has classes here, the command class.

And page content is the first chunk.

Here you can see that, until here.

And then the second document has, again, page content.

So, in this for loop, when I mark down chunk page content, I can see all the chunks.

The original text is this one.

And chunks are like this.

Okay, here 500, in one chunk we have around 500 chunks.

It's chunksize define how long one chunk is.

For example, if I make it like 100, here as you can see, it will be shorter.

And if I make it 1000, it will be longer.

And for example, we can use around 1000.

Now, what is chunk overlap?

Here, let me show you.

For example, the first chunk, how it finished, the result showed that the DNA model

can design something.

But here, you also can see that the results show that the DNA model can design a file four times faster than an integral method.

And what is the problem if we use chunk overlap 0, let me show you.

And just use chunk size 500 to see that clearly.

And we finished here.

Let's make it like 200.

Here table one, blah blah blah blah, the accuracy is calculated by dividing the smaller CL value by larger CL value by multiplying by 100.

But while I explain the project, what will we do?

Let me ask a question, we will check each chunk.

But here the problem is, we have a variable information inside this center.

But while chunking, we are also dividing this center into two.

So this part and this part along doesn't have any meaning.

So they should be in the same chunk.

So do that, if we have like chunk overlap 0, it will have like continue here.

The actual accuracy is calculated by dividing the smaller CL value.

It goes like a flat text here 0.5 and angular attack of 0 degrees.

And it goes like this.

But if I make it chunk overlap by 100, let's summarize again.

Here, for example, table one presents the CL value is calculated using x-foil, it's good like this.

And here again, the accuracy is calculated by dividing the analytical here dividing the.

But then it goes 100 characters before, analytical methods and the training DNA model.

Where is that? Here, analytical methods and the training DNA model.

Okay, this part in this chunk doesn't have any meaning.

But we already have that parts meaning very well in this chunk.

But in the first chunk, the second part, this center doesn't have any meaning because it's half of the centers.

When we come here, the accuracy is calculated by dividing the smaller CL value by larger CL value and multiplying with 100 to obtain a percentage.

Now in the second chunk, we get the whole center.

So, okay, here it doesn't have any meaning, we can't get anything there.

But in the second chunk, we got all the centers.

So this is how this chunk overlap works.

For example, if we have like chunk size 1000, you can make chunk overlap like 200.

And here you can get it, for example, the results show that the DNA model can design a field.

The further will date.

Here, if we use, okay.

The result show that the DNA model can design.

It goes like this, but here to further will date, further will date, it starts from here.

The center is divided here, but in the second chunk, it starts from here.

And to further will date, the DNA models, it goes like this.

The results show that DNA model can design a field for time faster than an article method.

Here, we couldn't get the whole meaning, but in the second chunk, we already got that.

So the main idea is, we are using this chunk overlap to avoid having half meaningless sentences.

That's all. I hope I explained it clearly.

Okay, guys, I think 200 is...

Okay.

It's better to have, like, if your chunk size is 1000, the chunk overlap should have like 10% or 20%.

It's okay. You also can have 150.

And then, here we define text-speitter than by using text-speitter, we are creating documents.

And these documents come from here.

And it's a parameter we are giving, long text, and it comes from here. I told you before.

And then, here we are marked downing and to show you that, now we don't need to...

Okay.

We don't need to see that. And here, summary is...

Okay, this text is not so much. So I will show you another way to summarize this text.

For example, we can summarize whole text, but let's summarize each chunk then print them.

Here, for chunk in chunks, we are changing this model and prompt template here.

And then, to get summary, we are using chain run, chunk page content.

So what was chunk page content? It is like this.

So we are giving this part to make the model summarize.

And then, summary is summarize of that part, and we are adding this summary into summarize.

List. And then, here, final summary, we are adding all the summaries one by one into final summary.

And let me show you that. Here...

Okay.

Let's run again. Here, these are chunks.

We have two chunks, but here, for two chunks, we have two different summaries.

First chunk summary is this one. Second chunk summary is this one.

After that, we can use here...

We mark down the final summary, then we can use the model, LL model, to combine these summaries.

Now, we have two different summaries. We can make the model combine these two summaries as a one concise summary.

In a simple way, just give LL model, here we already defined that.

Inside, we just give the prompt, and prompt will be combined following summaries into one concise summary.

And then, we are giving this final summary. Inside final summary, now we have two different summaries.

Then, here, we can mark down it, and then run again.

Here, we have two different chunks, and then two different summaries.

And we are combining these summaries into one concise summary here.

A trained deep neural network, the NL model, was used to design like a 4D Airfoil, a chewing end,

average accuracy of 99% when compared to analytical methods using exploits of air.

The NL model, the method high predictive, capability can also design airfoil, 4D, faster than traditional analytical methods.

That's correct.

This is the logic of how to use these chunks.

And of course, for this summary part, it doesn't make sense because we just directly summarize this part.

But, for example, if you again, if you are summarizing like 1000 page attacks,

so it's better to chunk because directly summarizing 1000 page, you can get error because of your computer can speak enough.

Maybe I didn't try that.

But while chunking, it will take longer time, but you will summarize successfully.

So you can do it, for example, like just give an example, you have 1000 page book.

First, chunk is like with 1000 characters, and let's guess we have 5000 chunks, 5 chunks for one page.

For each chunk, we get summary, and then for like 100 summary, we get one inside summary like this,

and then saving them into one another list, so reduce the summary into like 2 and 2,

like general summaries, and then for final prompt, summarize the final summaries again.

And in this way, you can get the summary of 1000 page book.

If it is part in this way, also it's useful.

So you can use it in another way.

Okay guys, I hope you understand it in the next video.

We will learn how can we tokenize this chunk.

Okay, we get them, but we will learn how the model see those text.

Okay, see you in the next video. Bye bye.

## Resources
[[18.py]]