---
title: "Use Ollama and Python"
date: 2026-06-11
course: "Ollama & LLMs"
instructor: "Course Instructor"
module: "Python Integration"
duration: "Video Tutorial"
tags: [course/udemy, learning, ollama, python, local-llm]
status: [[In Progress|Completed|On Hold]]
---

## 🎯 Learning Objectives
- [x] Install the official Ollama Python library
- [x] Import the library and establish a connection
- [x] Use `ollama.chat()` for structured conversational prompts
- [x] Implement real-time streaming responses
- [x] Use `ollama.generate()` for direct prompt completion
- [x] Understand the dictionary structure returned by both methods
- [ ] Explore browser-based UI with Streamlit (Covered in next video)

## 📝 Key Concepts & Notes
- **Prerequisite:** A model must be pulled locally via CLI before it can be called in Python.
- **`ollama.chat()`**: Expects a list of message dictionaries containing `role` and `content`. Useful for maintaining context or simulating conversation history.
- **`ollama.generate()`**: Simpler alternative that takes a direct `prompt` string. Does not require a message history structure.
- **Response Structure**: Both methods return a Python dictionary. Key metadata includes `model` and `created`. The AI's answer is nested inside the `message` key (for chat) or `response` key (for generate).
- **Streaming**: Enabled by passing `stream=True` to `ollama.chat()`. Returns a generator that yields chunks of text, allowing real-time terminal output.
- **UI Limitation**: The instructor notes that printing directly to the terminal is not ideal for production. A web-based interface using Streamlit will be covered in the next video.

## 💻 Code / Commands / Examples

### 🔧 Installation & Setup
```bash
# Install the official Ollama Python library
pip install ollama==0.2.1
```

```python
import ollama
```

### 💬 Example 1: Basic Chat
```python
response = ollama.chat(
    model='llama3.1',
    messages=[
        {
            'role': 'user',
            'content': 'Why is the sky blue?'
        }
    ]
)

# Access the AI's response from the returned dictionary
print(response['message']['content'])
```

### 🌊 Example 2: Streaming Chat
```python
stream = ollama.chat(
    model='llama3.1',
    messages=[{'role': 'user', 'content': 'Why is the sky blue?'}],
    stream=True  # Enable streaming mode
)

# Iterate through the generator to print chunks in real-time
for chunk in stream:
    print(chunk['message']['content'], end='', flush=True)
```

### ⚡ Example 3: Simple Generation
```python
response = ollama.generate(
    model='llama3.1',
    prompt='Why is the sky blue?'
)

# Access the response directly from the dictionary
print(response['response'])
```

## 📚 Resources & References
- [[2.py]]
- [[External Link](https://github.com/ollama/ollama-python)]

## ❓ Questions & Action Items
- [ ] Pull a local model (e.g., `ollama pull llama3.1`)
- [ ] Test `ollama.chat()` with a custom prompt and verify dictionary keys
- [ ] Implement the streaming loop in a local script
- [ ] Compare the output structure of `chat()` vs `generate()`
- [ ] Watch next video on Streamlit integration for browser UI

## 📖 Transcript Summary
The video demonstrates how to interact with local LLMs using the official Ollama Python library. It covers installing the package, importing it, and using two primary methods: `ollama.chat()` for structured message prompts and `ollama.generate()` for direct prompt completion. Both methods return dictionary objects containing metadata and the AI's response. The instructor also shows how to enable real-time output using `stream=True`, which yields text chunks iteratively. Finally, it's noted that terminal output is limited for production, with a follow-up video planned to cover building a browser-based UI using Streamlit.

## 🎥 Original Transcript
Hello guys, welcome again. In this video, we will learn how we can use Ollama in Python.

First, we need to install the Ollama library. Here I will share the GitHub link with you. You can see the Python code there, and I will also add a resource file to the course containing the Python scripts.

Next, we will use `pip install ollama`. I have already installed it, so the requirement is already satisfied. If you haven't installed it yet, it will take a little while.

Then we will go to Python. I am using Python, but if you use another editor, just type `import ollama`. Copy the import statement.

Here we will use `ollama.chat()`. First, we type the model, then the message. If you pull another model, like Gemma 2, you must install and pull that model first. Then, in your code, just type that model name instead of `llama3.1`. For the message, we type the role as `user` and the content as our prompt. When we print `response['message']['content']`, we get the answer. Let me run it. Before, I used a VPN which caused an error, but now it works. When you change the content, you will get different answers.

Let me show you how to print the full response object. It returns a dictionary. The first key is `model`, showing which model we are using. The next key is `created`, showing the timestamp. The `message` key contains another dictionary with `role` (assistant) and `content` (the answer). Accessing `message` and then `content` gives us the result.

We can also stream the answer. I will run the streaming part. We use a similar setup but add the `stream=True` parameter. This divides the response into chunks, which we can iterate over and print individually. As you can see, it writes the answer in real-time. To get results this way, use `stream=True` and loop through the stream: `for chunk in stream: print(chunk['message']['content'])`.

In this way, we chat with the model. We can also use `ollama.generate()`. I will share the Python file so you can run each example on your computer.

For `ollama.generate()`, we assign the response again. Printing the full response shows the dictionary with `model`, `created`, and `response`. We just need to access `response['response']` to get the result. By using the `generate` function, you provide the model and the prompt directly. Changing the prompt will give you different results.

I hope you understand how to use Ollama in Python. However, getting results directly in the terminal doesn't look very professional. In the next video, I will show you how to use Streamlit in the browser. This will allow you to chat with local models on a web page, making your projects look more professional.

If you have any questions, please ask me. See you in the next video. Bye bye.
```