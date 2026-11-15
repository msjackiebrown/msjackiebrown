---
title: Download and Use OLLAMA
date: 2026-06-11
course: Ollama & Local LLMs
instructor: "{{instructor}}"
module: Ollama
duration: "{{duration}}"
tags:
  - course/udemy
  - learning
  - "{ topic }":
status:
  - - In Progress|Completed|On Hold
---
## 🎯 Learning Objectives
- [x] How to Download Ollama
- [x] Ollama Commands

## 📝 Key Concepts & Notes

- **Installation Process:**
    - Go to `Olima.com` (sic) and click "Download".
    - Select your OS (Windows, Linux, or Mac).
    - Installation is simple; verify success by checking for the Ollama icon in the background/tray.
- **Model Registry:**
    - Accessible via `Olima.com` -> Models.
    - Models are published by providers (e.g., Meta).
- **Model Sizes & Parameters:**
    - **8p:** 8 billion parameters (~4.7 GB).
    - **70p:** 70 billion parameters (~40 GB).
    - **405p:** 405 billion parameters.
- **Next Steps:**
    - Learn to use Ollama in Python for project integration.

## 💻 Code / Commands / Examples
```bash
# View available commands
ollama

# List installed models
ollama list

# Download a model from the registry
ollama pull <model_name>

# Run a specific model
ollama run <model_name>

# Exit the running model
/bye
```

## 📚 Resources & References
https://ollama.com/

## ❓ Questions & Action Items
- [ ] Learn to use Ollama in Python (Next video topic)
- [ ] Document where to find things and commands (Personal goal)

## 📖 Transcript / Video Summary (Optional)
>Hello guys, welcome again.

In this video I will show you how can we download Olima and how can we use it.

First just go to Google and type here Olima download.

And here you will see Olima.com, just type on it and click on it.

And here you will see download button.

And I'm using Windows.

And we press on just choose Windows if you use Linux and Mac.

You can choose them.

Download it.

Actually installing is so simple.

I already installed and let me show you again.

Here it's already installed.

I plan it to install.

It will take a while.

Okay, that's all.

Now you will see this Olima photo here.

That means Olima is working background.

So how can we see that?

Just type here cmd and open the command prompt.

Let me make it bigger.

And then you type Olima here.

You will see this output.

If you don't see it means that you couldn't install Olima.

Here let's see we have serve create show run pull push.

Here let me show you list list models.

Where I type Olima list.

Here I can see which models I already installed.

Here Olima 3.1 latest I installed it.

Here Olima 3.1 8p here b is billion and other models you can see.

How can we install these models?

Here let's run again.

Let's see here.

When we use run method here we can run a model.

But before running a model we need to pull a model from a registry.

I will show you that.

For that let's go to here Olima.com again.

And here you will see models.

Let's click on it.

And here you will see all the models.

The latest model is Lama 3.1 which is which meta published.

And when you press on, when you click on this model you will see here three different

options 8p 70p 405p.

Here is billion parameters.

8p is 8 billion parameters.

This is the smallest.

And here you can see the size of these models.

For example 8p is 4.7 Gb.

And 8p is 40 Gb.

And how can we run this model?

We can use Olima run this model.

But before that we need to pull this model.

For ends here, for example we choose this 8p.

Let's copy the name of the model here Lama 2.1.

And come back here.

Lost this one.

Come back here and type.

Olima, here we will use pull and the name of the model.

And we type enter.

I already pulled.

I already download this model because of that.

Here you can see all a 100 person.

But it will take a while, like around 10 or 20 minutes.

It depends on your internet connection.

And you need to wait to install the download 4.7 Gb. here.

Now we have this Lama 2.1.

How can we use this?

Model.

Again, I already copied that.

Now we type Olima run the name of the model.

It means that I want to use this model.

Here, now this model is running.

So I can ask a question here.

So I can type anything.

Like just type hello.

If I type hello, hello.

How can I still today?

We can ask a question.

For example, why is Sky blue?

Here, let me ask a question.

We get answer.

This is how we download Olima.

How can we pull any model which Olima has?

And then after that, we can see all these models

by using list here, Olima list.

And then to use any model here, we just type Olima run

the name of the model.

And when we ask a question here on the command prompt,

we can get answer.

But as you can see, it's not very useful.

So we need to learn.

In the next video, we need to learn.

How can we use this model, this Olima in Python?

In this way, you can use this model in your projects easily.

Yes, I hope you understand.

And here, to go out of the model, now the model is running

background.

So if you look at here, when we type slash ends,

question mark, when we type slash by, it means exit.

To exit the model, just type by here slash by.

When we do that, we exit the model.

OK, guys, I hope you understand.

If you have any question, please ask me.

See you in the next video.

Bye-bye.
```
