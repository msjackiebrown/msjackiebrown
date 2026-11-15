## Transcript

So guys, welcome again in this video we will learn how to apply the most similar

sentence into text and here we have a reference sentence and we have a long

text first we will simply this long text into sentences and then we will check

each sentence unity after that we will order from like most similar to

less similar let me show you run the code here we have reference sentence it

is nlp enables computers to understand human language here for example most

similar sentence is this one and similarity is 0.8956 it goes like this

and what's the sentence the ultimate goal of nlp is to enable computers to

understand interpret and generate human language in a valuable way here as

you can see it's really close nlp enables computers to understand human

language here all the goal of nlp is to enable computers to understand human

language the second one

similarity 0.81 to 2 by technology and advanced advances nlp continues to

involve improve and making it an exciting area of study not as close as the

first one third question language natural language processing nlp is a field of

artificial intelligence that focuses on interacting between computers and

humans true natural language here as you can see guys the first sentence is

really close so when we have a like long book we will have chunks and each

chunks will be like one paragraph or two paragraph and they will really close so

to find the really answer like the answer what we want for example for these

problem don't need to look at the other three sentences for example to validate

these sentence for example this is the paper and we have a finding so we need to

validate our findings so just find out the first sentence is enough to

validate our findings I'm just giving an example so don't need to look others in

this way we will save time okay let's look at the code now we just use space

guys because in the previous video we downloaded the model so don't need to use

spaces CLI here client and we will use these similarity functions or don't

need to use numpy also and we are using this model and we have this function

ciplate takes into sentences here first we are using like converting this text

into like nlp the object here and then we are creating a list I hope all of

you know this form creating the list here document this one sentences

guys create sentences there for send in dog sends let me show you how these

dog sends looks like to make your understand better okay

and here it's an object and in that object we have like sentences okay how can

you also we can have okay let's print them

here as you can see we easily can simply this sentences the text into sentences

here you can see that or to converted into a stream we are using text here

sentence text will be that one you will have same here you can see that so in this

part we are adding this sentence one by one into a list so this function will

return a list which has the sentences in this text that's all okay let's come

here later you can take it after that we are calculating similarity in this

function and to find similarity we will use reference sentence here is one and

sentences here sentences is a list we get from that function and we have

similarities is a list for sentence in sentences we have many sentences here

similarity score we are using the same code here nlp reference sentence

similarity another the second sentence and in each loop the sentence will be

different but we will always use reference sentence and in our project we will

use our prompt and these sentence will be chunk in chunks and then we are adding

similarities upon a table we are adding that first item is sentence because

we want to keep that sentence and second one is second item is similarity score

okay so when this loop finished we will have a list similarities list which has

tuples and that tuples the first item will be sentence and second item is the

similarity between this sentence and reference sentence after that we are

returning these similarities and then we are when we have a list we will

reorder this list here by using this sorted function similarities list

kylamda x1 and reverse true here if reverse true you will order the list from

highest value to low value and this one comes from because one is index here

you can consider x is this tuple x is the item in that so what is the similarities

similarities are first item no the second item because of that we are using one here

let's run again here if you change this part you all for example if you put

let's let me show you for example we you create a list which has tuples and

in tuples first item will be decor and second item sentence and you want to

reorder this list according to this similarity score right but now the

score is the zero index first item to reorder that now we need to use zero index

here let me run here I think there is no problem but when we are writing right 48 okay here we have

problem yeah because they are changing now actually we can give it them same and for here

so on the list is one

okay working same again similarity is here and optimal goal of NLP is to enable

competitors to understand a human language in a valuable way the same order and if you make this

reverse true to false you will find the opposite order here the less similarity to higher

similarity

okay but this zero index is important because I want to show you for example you have like more complex

projects you have a list like this and you have tuples and in tuples you have like five different

items and one according to one item you want to reorder that list now for example if that

important item values are like gifts item here so you need to use for index four and according

to that you reorder it I hope you understand how it works okay as now I think you understood how

works I said again in the next video let's start to structure our final project so

for this text we will give a long text and for reference sentence we will give we will ask a question

and then we will just like write the closest like 10 chunks we will do similar things

okay if you have any questions please ask me see you in the next video bye bye

## Resources
[[20.py]]