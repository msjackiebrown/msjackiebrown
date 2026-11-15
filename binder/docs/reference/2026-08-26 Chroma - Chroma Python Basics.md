---
title: "Chroma Python Basics"
source: "https://www.youtube.com/watch?v=yvsmkx-Jaj0&t=3s"
author:
  - "[[Chroma]]"
published: 2025-07-02
captured: "2026-08-26T08:09:35-04:00"
description: "Itai walks us through the basics of using the Chroma Python client.Learn more at https://docs.trychroma.com/docs/overview/getting-startedChapters:0:00 Introduction0:38 Ephemeral Client1:14 Inge"
status: "clipped"
type: "web"
processed: "false"
site: "youtube.com"
tags:
---
# Chroma Python Basics

## 🔗 Source
- URL: https://www.youtube.com/watch?v=yvsmkx-Jaj0&t=3s
- Site: youtube.com
- Author: Chroma

## ✂️ Highlights / Excerpts
![](https://www.youtube.com/watch?v=yvsmkx-Jaj0)

Itai walks us through the basics of using the Chroma Python client.  
  
Learn more at https://docs.trychroma.com/docs/overview/getting-started  
  
Chapters:  
0:00 Introduction  
0:38 Ephemeral Client  
1:14 Ingesting Data  
2:57 Reading Data  
5:14 Persistent Client  
6:27 HTTP Client  
7:09 Cloud Client

## Transcript

### Introduction

**0:00** · Hi, I'm Itai. In this video, we'll walk over the basics of getting started with Chroma in Python. To get started, let's create a new virtual environment in Python and let's activate it and install Chromob.

**0:21** · We'll create a program that lets you ask questions about your documents and get AI powered answers. Using an online stores policy file as our example, we'll ingest the content into Chroma and use it to build relevant context to an LLM for accurate document-based responses.

### Ephemeral Client

**0:38** · Let's get started with a simple Chroma server running in memory. This is a great way to experiment with Chroma when you're just getting started with retrieval. I'm going to import Chromobb and make a new simple client.

**0:53** · Next, let's create the Chroma collection that will index our data. So, we're going to type in collection equals client create collection. And let's name this collection policies. As I mentioned earlier, we have a file with a bunch of policies for an online retailer in our project. Let's take a look.

### Ingesting Data

**1:15** · So, we have policies.txt txt where on each line we have a different policy for this online shop. This is important because when we submit queries to our Chrome collection, we only want to get the parts of our document that are relevant to the query. So, we want each record of our collection to represent a small part of our document. This is often referred to as chunking data. I'm going to open this file policies.ext.

**1:43** · You want to read it and go for a basic UTF8.

**1:50** · Like we said, this is going to be a list of strings and we just want to get the lines. Now we can simply add these to our collection using the dot add method.

**2:06** · I'm going to call collection.add.

**2:09** · We need to provide a list of unique string ids. So let's import UU ID and provide a unique ID for each one of these records.

**2:29** · Our documents that we want to store are basically just our policies. And we can also add metadata to these records. Here let's add the line number in the file used to generate each record. This can be useful for debugging and citing the source. So metadatas equals a dictionary. Let's call this key line and get the line for each one of our policies.

### Reading Data

**2:58** · Let's get the first few records to see what's in our collection. I can use collection. peak which gets us the first 10 records of a collection. And let's run this program.

**3:11** · We can see in the output that we got the list of IDs for the records, um the truncated embeddings for each record, the actual documents themselves, and uh the meta datas. Let's submit some queries to this collection. I'm going to save the results into this variable and let's call collection.query.

**3:35** · We're going to submit two queries. So the first one will be what is the return policy and the second one can be can I return customized items.

**3:53** · All right. And by default, Chroma will return 10 results per query. Um, we can change that by setting the end results argument. Let's set it to five over here.

**4:07** · To display these results, um, let's loop through the documents property of the results object.

**4:18** · And we want to know which which query we're working with. So let's enumerate them.

**4:26** · We can print uh a little title here. So this would be query I and let's print the results line by line.

**4:42** · All right, let's check it out. What happened under the hood is that Chroma embedded this query and ran similarity search against the embeddings in our index and we can see that we got pretty good results. Uh all of these records are pretty semantically similar to the query we submitted. This will help us to build the correct context for an LLM to answer this question. So that's it. We built a simple retrieval pipeline.

**5:12** · We can also change how our Chroma server runs. Currently, our server runs in memory. This allowed us to quickly experiment with Chroma. Alternatively, we can use the persistent client to actually have our data saved on disk and available across multiple runs. All we need to do is change the type of client we instantiate. So here at the top, instead of instantiating a simple client, we are going to choose a persistent client.

### Persistent Client

**5:42** · We can also specify the path where we want our data to be saved. So let's just say in the current directory uh and let's call the subdirectory chroma data.

**5:54** · Okay, let's run this.

**5:58** · And if I ls over here, I can see the chroma data persisted in my current working directory. There are some things we need to change as a result. Since the policies collection is already created, we have to swap this call for get or create collection because collection names are unique per database. But this also means that we can comment out the data addition logic and this program will still work.

**6:25** · When you install the Chromma DB package, you also get access to the Chroma CLI. It lets you run a Chroma server locally, which you connect to using the HTTP client. If you deploy Chroma yourself, you will also use the HTTP client to connect to a deployed Chroma server.

### HTTP Client

**6:44** · Let's start the server using Chroma Run.

**6:47** · We can see that our Chroma server is running at localhost 8000. If you go to our docs, you will see ways in which you can customize this. Now we can swap the persistent client for the HTTP client and we can specify that our host is at localhost and our port is 8000. And that's it. Finally, if you're a Chroma cloud user, you can use the cloud client.

### Cloud Client

**7:14** · To get it to work, we need to set up some environment variables, and the CLI can do that for us. First, let's use the CLI to login. I'm going to type in Chroma login.

**7:27** · There we go. We got a successful login.

**7:31** · I will log in with just my default team.

**7:36** · And now I'm going to type in chroma DB connect. The name of my database is hello world.

**7:46** · And I'm going to use the dash dash and file option.

**7:52** · And if I c my N file, I can see that the environment variables I need are set with my API key, tenant, and database name.

**8:03** · Now I can simply instantiate a cloud client.

**8:09** · And there we go. We can see our collection in Chroma Cloud. All right.

**8:13** · So, we ran through the basics of getting started with Chroma, and we can't wait to see what you

---

## 🧠 Why I Saved This
-

---

## 🧭 Processing Decision
- Destination:
- Notes to create: