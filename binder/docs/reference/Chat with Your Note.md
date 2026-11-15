## Transcript

Hello guys, welcome again in the previous video we learned how can we chat how can we ask

a question to a very long text. In this video, we will learn how we will make a project

which we can chat with a node. Here, this can be useful when we are making a research.

For example, you are a researcher and you are planning to write a paper. At first, you

are just doing a literature review. To do that, you need to read newspapers or you are reading

some text from websites and books, textbooks, and you will save them. At the end of this

video, you can save it for example, it can take like one to two weeks. Then you will answer

questions to that text and your questions will be answered according to your text. In this

project, we are doing that. For example, I don't use other papers like I will copy past

from the same story in the previous video. For example, we are reading a paper and this

information is really reliable for us. I think, okay, this information can be useful later

for me. But now I'm not sure. I'm just doing a literature review. I'm just trying to

find the idea. Let's copy this one from here, paste, copy it and paste here and save.

Let me save it because, and here we have a text file here. As you can see here, we saved

it. But it means that, for example, I closed this one. Okay, today it closed here. I don't

have any text, but I already saved it. If I keep saving tomorrow, the text here will

keep increasing. I'm saving all these literature in the same text file. Okay, tomorrow I start

searching again. I found another information, for example, this one. Come here, save it,

here. Let me show you. As you can see, it was like this before. Now we have more lines. And then

I keep searching. I found this one. Come here and save. And again, our text keep increasing.

Now, we don't have any order here because we don't have that. So if you are doing this,

for example, without using a lamp, how can we use that? We can save this information in a

virtual file. So we need to define like titles or other things or we can use other taking notes

tools. But after some time, for example, if you're not like take 100 or 200 pages, it will be

so complicated. So it will be difficult to find information. But now what we know, we can use

chunk, chunking methods to get all these information separately. So if there is a very valuable

information here, then we ask you question, we can find most similar, most close answer. So we

don't need to worry about here like this complex and like this ordered text. What we just need to do

is just find the label information, copy it, paste it and save it. Okay, for example, now we are,

we just finished the review and let's ask you question. Here, for example, there was a girl, Mary.

I'm not sure we saved and is there any Mary in the text we saved. But let's ask who is Mary.

Because our text is short, so it insert quickly. According to text, Mary is likely to project

protagonist. It's correct. Of the story, young girl who is wasting, living at a state

where bandwidth, better stuff works as a gardener. It seems to be curious and friendly. As you can

say, it insert. So if it was your like literally review about papers or about research topic,

when you ask a detailed question, you will get an answer, very good answer, according to

this text. Why it's important? Because you know what you saved is correct, because you took

them from different papers. So you can trans, trans, that answer. Otherwise, if you ask

change GPD directly, okay, you can get an answer, but you can't be sure that answer is correct or not.

So this one is the safer way. Okay, guys, this is the project. Now let's look at the code here,

as you can see. Text is increasing. So then it will be always here. So when we close the

python and two weekstates, when we open it, all this information will be still here.

Okay, the libraries are same. We didn't change anything here.

We are using again spaces, this model same title, change width, you're not.

But here I added form and key here, my form, you can change it. It's not important here.

And clear on some true, if you make this true, when you write something and say, this text is gone.

If you make it false, even if you say it, text will be here again. So I make it true.

And then in this form, we are creating a text area, level, paste your notes here,

paste your notes, you can see that. And height again, 300. So I can see it clearly.

And we are adding a button here, submit button, STF form, submit button,

and level, save here, you can see it. And this part is a form, we can use it in streamlets.

And then if this submit button is true, so whenever I click on this save button,

we are checking not, not is this text area. So is there something in this text?

Yes, we are entering here, condition is okay. First we are reading, not text, this is text file,

so you can change it. Here are comes from read. So we are opening this text file to read as a file.

Then content will be file read. So now content is the text inside this text file.

Okay, after that we are checking if not the text in this text area inside this content or not.

Actually, why we are doing this? Probably you don't add two times, but

the advantage of this streamlet library is, maybe some of you realize that,

whenever we change the code, we don't need to rerun the Python code.

Automatically we can see the change here on the page. I think most of you realize that.

That's because whenever we click something on this page or button,

behind this page refresh like a few times.

So, whenever, for example, when we click on submit button,

and when we have not here, if we don't check this one, this condition,

we can add, like same text, can be added into text file a few times.

For example, for the last time, if we add this part, if we don't add this condition,

if we don't check this text inside already inside this one, you can see this text here,

like three same text here. You can check it and this is one of the advantages of streamlet.

So, you should have a variable of that if you want to use streamlet.

So, you will face this problem, for example, if you have a list, like there is a list here,

a is empty list, and then if you are filling that list here somewhere, so when you click

somewhere on the page, because of this line, this list, a is a list here, will be empty again and again.

So, you can't add something always into a dead list. Because of that, you should save this list

in JSON file or another in file and then whenever you increase the content in that file,

you should check it. If the data you want to add in that file is already or not,

is already in or not. Because of that, we are checking here.

Okay, when we make sure this node is not inside the content in the file, we are adding,

okay, this content is the text before and we are adding the node tab and we are using a two-bed

slash here to go below line. After that, we are now we have a new content,

but to write this new content into a file, we are opening the same text file with w now,

w comes from right, is a file again and file write content. So here what we are doing, first we are

reading the file and and then we are checking if the node is inside the content or not. If it is not

inside that, we are increasing, we are adding the node to content and then we are

saving this content into not text file. Okay, this is what happened when we write something here and then

click on save. Now, what about we ask a question here. Again, we have a text input, actually this part

almost same, but I changed some part. We have a text input and through your question here,

you can see that, and ask button. If button true and if question true, it means that I wrote something

here and when I click ask, we are entering here and we are defining model same and we are defining template

here and I didn't change this part. You have a helpful assistant, please answer the following question

based on below text, a question here, text here and then from template, we have two variables here,

and question. After that, the two separate chunks before we had a long text here and

we are giving long text here, but now we need to split this content into chunks.

So because of that, we are reading the text file and now content is our content and we are

defining text filter here. Changsize 1000 overlap is 150 and then we are splitting this content

here into chunks. After that, we are actually doing the same thing. We are creating a empty list

similarities and then we are finding the similarity between question and this chunks.

Here, after that, we are reordering these chunks from most similar to last similar and we are taking

the first three. For example, if you are studying with paper, you can increase these two 10 to get

more comprehensive answer, then change it. After that, we are creating a text here and then we are

adding the text from these chunks into this one and then we are giving this text as a text in this

model and question. We already have question here and we are getting answer in this way

and we are just writing answer by using markup and this is happening. So who is Mary?

Can we ask? So now we don't need to add anything here because then we ask we are reading the text from text file.

Okay, now this is the answer. Mary is the main character of this story and here because we are

using LLM. For now, if you don't like this answer, simple, just ask again. I'm going to ask

here as you can see the answer different. Okay, yes, I hope you like it. I think this is helpful,

like useful project. In the next video, let's make another project chat with your diary.

And we can chat differently. For example, if you are taking diary, you should

start with today is this one. I did this one, this one, this one and then you ask, okay,

when I get go to like a city to travel and model the answer, you went there at these dates and you

did this one, this one. So in that project, you simply chat with your diary. You can ask questions

about your past. Okay, so if you have any questions, please ask me. See you in the next video. Bye.

## Resources
[[22.py]]

### 🧠 Why I Saved This
- Implements a lightweight, file-based RAG pipeline that grounds LLM responses in verified research notes, directly mitigating hallucination risks during literature reviews.
- Demonstrates a critical Streamlit state-management workaround: checking existing file content before appending to prevent duplicate entries caused by automatic page reruns.
- Provides a practical chunking and similarity-retrieval workflow (size 1000, overlap 150, top-3 retrieval) that balances context window limits with answer relevance.
- Establishes a scalable, low-friction capture system for iterative research, allowing unstructured note accumulation without upfront taxonomy or complex database setup.

---
### 🧭 Processing Decision
- **Destination:** Resources/LLM-Workflows/Local-RAG-Pipelines
- **Notes to create:** `[[Streamlit State Management Pitfalls]]`, `[[Local RAG Implementation Checklist]]`, `[[Research Note Capture Workflow]]`
- **Processing steps:** Extract the core Python/Streamlit code block into a dedicated snippet note and link it to the main Langchain workflow index. Tag with `#llm/rag` and `#python/streamlit` for quick retrieval during future research tool development.