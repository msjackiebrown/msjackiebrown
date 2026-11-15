---
title: "Use Streamlit"
aliases:
- "Use Streamlit"
date: {{date}}
course: "{{course_name}}"
instructor: "{{instructor}}"
module: "{{module_name}}"
duration: "{{duration}}"
tags: [course/udemy, learning, {{topic}}]
status: [[In Progress|Completed|On Hold]]
---
## 📖 Transcript / Video Summary (Optional)
> ## Transcript

Hello guys, welcome again.

In this video, we will learn how to do a very simple

stream knit project.

Here we have a title, Olamah, and we have a text earlier here,

and a button, and we will have a label.

For example, when I type Hello here,

and then press on OK button, here I will see what I type here.

Like, how are you?

And when I press OK, here I will say, later when we enter

and integrate this model, here we will type our prompt.

And here we will see the answer comes from the model.

But first, let's learn how can we do this simple project

with stream knit, and if you look more professional.

And this is our code.

Actually, stream knit is really simple and useful.

If you just know Python, and if you want to do a website,

you can use stream knit.

Here, first we need to install stream knit library.

So to do that, you can type like pip install stream knit.

And I already installed it.

And then, I'm here in port stream knit is st.

So to create a title, we are using st title.

And here you can type what you want.

So I type Hello because of that here I am seeing Hello.

And then I created a text earlier here, st text earlier.

Here we have a parameter level, right your prompt.

So if you change this one, here you can see right your prompt.

So you can write more creative things.

And then, to create a button, we are using st button here,

st button OK.

And if st button OK, maybe it's a little confusing.

So it's the short way, better way.

But to understand better, maybe you don't use before this stream knit.

As prompt, we can create a button like this button,

st button OK.

So we just don't run this one.

So if you do like this, we also can have OK button here,

sign I type.

When I press on OK button, nothing happened because in the code,

I change it.

Here, I create a button.

So this button returns true false.

When I press on this button, it will return true.

And here, actually I am doing if this button passed.

So it means if this button true, I'm also doing,

I also can do this in this way.

And if prompt true here, if there is anything in the prompt,

and prompt will be what I write here.

Now prompt is st as here.

And then I am typing as a markdown here, st markdown prompt.

So in this way, when I press OK, here I can see what I type.

Like what?

It can be what.

So I forgot to show you how can we run this model?

To run the model, let me close it.

We just don't run this streamlit as like run this Python file.

We don't do that.

To run that, we are using here.

I hope you can see that.

Streamlit run is Python file.

It is open form folder, open form slash check online.

So just type the name of the Python file.

Streamlit run the name of the Python file.

So when you press enter, here there is a new page open.

Also, here you will see local URL.

So when you click on this link, you will go to that page.

If you close it here, for example, I close it here, I close it.

And when I press on, I click on that link, here I open again.

So I type hello.

OK, here I can see that.

OK, as this is, how can we use streamlit?

It's really useful.

You can use it as a website.

You also can do your own website with streamlit.

I did myself.

OK, if you have any questions, guys, please ask me.

In the next video, we will integrate that model into this one.

So here, just we will change this part.

See you in the next video.

Bye.
### 🧠 Why I Saved This
- Demonstrates Streamlit's script-execution model and conditional state handling (`if button:`), solving the common beginner pitfall of understanding how UI interactions trigger Python logic without traditional frontend frameworks.
- Provides a minimal, production-ready boilerplate for rapid AI tool prototyping, enabling quick deployment of LLM interfaces using only Python and standard imports.
- Clarifies the exact CLI workflow (`streamlit run <file>.py`) and local server behavior, eliminating setup friction when transitioning from terminal scripts or notebooks to web-based applications.
- **Specific problem solved / skill built:** Bridges the frontend-backend integration bottleneck for Python developers by teaching rapid, framework-free UI prototyping and interactive state management tailored for local AI applications.

---
### 🧭 Processing Decision
- **Destination:** `Resources/Python-UI-Frameworks/Streamlit`
- **Notes to create:** `[[Streamlit State Management Patterns]]`, `[[Local LLM UI Template]]`, `[[Python-to-Web Deployment Checklist]]`
- **Processing steps:** Extract the core UI boilerplate code into a reusable snippet note and link it to the main `[[Ollama]]` section index. Tag with `#python/streamlit` and schedule a 10-minute review to adapt the template for the upcoming LLM integration video.