## Transcript

Hello guys, welcome again in this video we will learn how can we convert a text into a vector

for free because there is also models for example OpenAI has an embedding model but you need

to give money but we will use spaces library to do that actually with this library we can

directly find the similarity I will show you one by one first I want to show you how this

library is useful to find similarity for example we will have your text one text two different

texts and I want to you just consider these are chugs for example I will find the similarity

two chugs and to find the time consumption how long time consume while we are finding this similarity

for that I use a for loop here 100 times it means that for example you will ask a question

what happens if you find similarity between our question and 100 different chunks

to see that when we run here first I am printing this time and here as you can see if it is 1.03

it means that this library spaces can find the similarity between 100 chunks in one second

if you have 1000 chunks different chunks it will take 10 seconds

I think that's quite good and here the second print is we are printing similarity

and here as you can see it is 0.91 to 20 to 1 and these are like similar texts

and we call this similarity also cosine similarity and this value change between minus 1 and

positive 1 so if it is close to 1 positive 1 it means that these two texts is similar

and if it's close to minus 1 it means that they are really different

let me show you here for example I just copied this text here and passed here

and then now we know that they are same so it should be 1 let me show you that

here as you can see it's almost 1 0.9993 and again it's around 1 second

but if I just delete this part and just put dots

run again

now there is no similarity here and here you can see 0.23

goes like that it's far away from 1

okay let's go back and

okay now they are different text

so how can we find these similarities

here we have a function here first let's talk about this model

so to use this lower model let's consider this library as whisper library we use text to

transcribe audio into text like that before we need to download a model like this one

and core web md here md comes through on medium you also can use sm small or lg large

but I checked also large model the performance almost same so don't need to use

large model md is enough but if you use this model for the first time first you need to download

model to download it you need to import phasing dot client here CLI

but for the first time it will download but when you run second time don't forget come on

this line because if you don't come on it will keep downloading again again and again

so this line doesn't care you download it before or not if it is open it will keep downloading each time

so for the first time open it then don't forget to close it here when we download it we can load now

this model nlp space load this one now nlp is our model and we have function here vector1 nlp

text1 and then dot vector now this is the vector of first text let me show you here let's look

one time and then let's print text1 and then vector1

so we will see how this text1 looks like

here normally we are seeing like this but to find the similarity first we will convert this text

into a vector like this and it has 300 dimensions as I know let's check it then

yeah 300 vector size is 300 and text2 is the same

let's check the text2 here this one text2 and this one the vector of text2

but to find the similarity actually what we are doing we are just finding the similarity

cosine similarity we to win these two vectors so how to find cosine similarity is the equation

here so to calculate it we are using numpy so import numpy as np but to explain this equation

better I prepare the PDF file here I will share on resource part you can check it in detail

but the upper part the first part we are just finding dot product of these vectors then we are

finding magnitude the second part magnitude and then we call it actually cosine similarity and

the value change between minus one and one if it is close to one it means that they are

same they are on the same direction okay I will share it if you want you can read it carefully

now comes here so this similarity gives us a video like 0.09 but

the good thing for space space also has its own a method for that like this

similarity let's don't print this one and

let's remember if we calculate by using this equation we find similarity 0.9121

now we don't use this equation we just use this one similarity nlp takes to one

similarity nlp takes to and don't use this one because we don't need to use it

actually this similarity function here metal do these things background so we don't need to write

three lines here instead of that we just type one line like this okay I will show you it will

give the same result 9121 right again 9121 so instead of using this like promoting vector and then

using this equation to calculate it we just directly use this one line nlp first text here we will

make in our project final project nlp our question our prompt and then in the for loop we will

check all the chunks and then here the second one will be like Changguan Changtu Changtri if it

will go like this and in this way we will find the similarity all the similarities between our

prompt and all the chunks later we will reorder those similarities from higher to lower than maybe if

you want to check or get answered from like 10 answers we will get the higher first 10 chunks

which has higher highest similarities this is the idea okay guys and is there anything else

I need to explain so we just need to use spaces space client so nlp and time I use time to show

it will take really short time for example if we find similarity of 1000 chunks it will take

around 10 seconds so if we are working with like very long text like nobles or other like for

example if you have 1000 different papers so when you use equation it will take a little longer time

but for other options it will be like shortest here as you can see 1000 times finding similarity

1000 times it will take just 10 seconds I think that's really good okay in the next video guys let's

go slower I will show you for example we will have one constant sentence and other like 5 or 10

different sentences find the similarity between all these sentences and reorder close the sentence

to like different sentences just understand better this similarity if you have any question please

Sme see you in the next video bye bye

## Resources
[[19.py]]