## Transcript

Hello guys, welcome again. I completed this chat with your diary.

Project, first let me show you how it works later.

We will learn and we will check the code.

Here we have an option here to select a date.

When we open the page, it will always today's date.

Now I'm shooting this video to 21st September.

But we can change.

Then we can select any date here as you can see.

For example, you write a sentence here.

For example, today I went to China.

Okay.

Save it.

And then another date.

Okay.

I went to Spain.

And save it.

Just we consider we are taking no signs.

Writing diary every day.

Today I went there.

I did this one.

Learn this thing.

We wrote many things.

And we have a question.

We want to add something to our diary.

For example, when it's I go to China, I forget that.

And I want to learn it.

Here these are the similarities.

And answer according to your diary, you went to China on September 21st and 2024.

Here as you can see, it answered correctly.

Now let's see how did we do this.

And additionally we used two different libraries to get time.

They are importing date time from date time, date time, import date time.

And we are saving this diary into JSON file here.

So to use that we are importing JSON.

And then again, in space we are using the same model title.

Just chat with your diary.

And to get the date today, we are using this code date time now date.

It gives us the date with like a year, month, day, like hour, until 2 milliseconds.

And then we have the date time.

After that we are adding this date input.

And here we have this one selected date.

Level is selected date.

And the value is today.

We define today here.

And because of that, when I refresh the file, I'm seeing today's date.

For example, if I refresh this page tomorrow, I will see the 22 here.

That's because what we are defining value here.

Okay, now selected date is this date.

After that we have a form again.

And here text, not write your diary here, level.

And see that, height 300 again because probably you will write long text.

And then we have button here, say button.

And if say button and not true, we have a selected date.

So to use this set date, we need to convert this set into string.

Because we will use this date as a key in the dictionary.

So set date string, set date.

And then we are opening diary, diary JSON file.

And first we read it.

And then we are loading this file into data.

Now data is dictionary here.

So as you can see, the key of this item is the date.

Value is our diary, what we write.

And I just add two different dates.

The first date is this one, second date is this one.

So if I keep add different dates, it will take here increase.

Okay, now first we are reading this and data now is this dictionary.

After that, we are checking the selected date inside data keys.

So here keys, data keys is a list which has all these keys.

And what is keys here is dates.

Here we are checking that.

Did we add any diary on the same date?

For example, today I wrote a diary.

Like I want to do this thing, this thing, and then save it.

Later I remembered, oh, okay, I did all this also.

So I should add that thing into the diary.

But the date is same.

So we are checking here.

If the data, selected inside data keys, it means that if this is true,

before we already added some text into this date, on this date.

Okay, if it is true, we are later we are checking that.

If not, not in data, selected date.

So here we are going, for example, if the date is today,

this part is here.

Today I want to try now, it's a string.

And here we are checking not what we wrote here.

Inside this one or not.

So if it is inside, it means that we already wrote it, so don't need to add again.

And because of that, we are checking it.

If not, not in in that text, we are increasing.

We are adding this note into that string.

For example, now I already have today I want to China, right?

I come here, the date is same.

Today I want to China.

Say again.

Here as you can see, nothing changed.

Because here we are checking not in data, selected dates.

So because of this one, we didn't add that note.

But if I add other text like hello, hello is not inside that text.

Say, I'm going to come here, as you can see, the date hello.

And then I can add hi.

I am here.

I in China, we have probably got off that.

I just add these characters here.

You can see we already added that.

But whenever I add, I try to add same text here, but in change.

Okay, that's because from the cloud of this line.

And then we are adding this one.

Here we are adding not into that text.

And in this way, we are changing the contents of this data.

So later after that, we are writing this data into Jason file by using this code.

Jason DOM data is this dictionary into Jason file.

We are reading this Jason file as Jason file.

Okay, here we are checking if selected date in data keys.

It means that we already add on that date and we want to add something again.

But mostly we will use the will add diary on the dates which we didn't add before.

So else, if it is not inside data data keys, we are creating a new key in the dictionary

by using this code data.

Selected date is a new date.

We'll be not.

Not is what we wrote on the text area.

And here we are, we changed the data.

And then we are writing, we are saving this data into Jason file.

So this is how we save our diary into Jason file.

Okay, now let's learn how can we ask questions.

How can we make the model answer our question according to this diary?

Again, we have question and button text area here, text input and button.

And they are same. I didn't change them.

And we are checking if button and question is true.

We are defining model and template here.

I just changed. Please answer the following question based on the below diary.

And question diary, same. And question text we have.

So input variables again.

Now we don't need to chunk the text because we will consider each date is one chunk.

For example, this text is one chunk.

This text is one chunk.

So we don't need split time. We already split our call diary into dates.

And because of that, we don't use this part.

And we are just reading our Jason file.

The Jason file here. And now data is dictionary.

Okay, then we have a similar to this list here.

For dates, there are in data items.

Then we use items.

Here data items will be a list.

I can show you.

It will be a list.

And in the list, we have couples like this.

And first of all, we will be key.

And in the top of first item is the key.

Second item is the value. This text.

Okay.

And in the for loop, we are taking date and diary in this way.

The diary is a text.

That is the first item here.

And of course, to find similarity, we are using this diary part.

So in the epic question, we are taking question here.

Same.

Similarity diary.

And then when we are adding these similarities,

similar to the score with diary, we are adding,

we are saving them with the date.

So we are creating a tuple again.

First item of the tuple will be similarity.

But second item will be this extreme.

And it will look like dates, something.

And then I go underline.

And diary is the diary.

Now in the similarity, we have many tuples.

And then the tuple has two items, first item.

Similar to score, second item, the diary.

Including the date.

Date is important because, as you question,

model answerer or question according to date.

Like I asked when did I go to China?

It answers the date.

So if you don't add this date into the text,

a model can't understand when did you do that.

So this is important.

Okay, now we have a list.

After that, here we are ordering this list according to the similarity scores.

And all the chunks, I didn't change this name of the variable.

But you understand that we are using the same thing.

Now chunks are the dates.

And we are creating an empty text here.

Actually, here I didn't change anything.

We are just choosing the most similar tree and diary.

And then we are adding, we are merging those tree diaries into one text.

And then we are asking the question.

We are asking the model answerer or question based on this text here.

And when we get answer, we are just writing that answer.

That's all.

Okay, guys, I think this is also useful.

Actually, I also like it.

I don't have habits to take diary every day.

But when I did this project, actually, that looks good.

So I am pretty communion to take diary.

Just write something and say it.

And whenever you want.

And then you don't remember something you did.

Just ask the question and get that question that you get that answerer.

Quickly.

Yeah.

And probably because of this project, I can start taking diary.

What do you think about that?

You also can tell your ideas and send messages to me.

Okay, guys.

Now, I don't have any idea for future projects, but I will think about them.

And when I find I will keep doing similar projects, useful projects.

And I try to think.

I try to do some projects which can be useful in your real life.

I don't want to do something just to do.

That must be meaningful.

Okay, see you in the next video.

Bye-bye.

## Resources
[[23.py]]