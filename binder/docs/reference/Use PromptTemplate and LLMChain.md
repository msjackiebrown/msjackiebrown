## Transcript

Hello guys, welcome again. In this video we will learn how to use prompt template. We are

creating prompt by using prompt template. And then to use this prompt which is model because

we need to give our prompt to the model as a parameter to get the answer. To do that

to combine model and prompt we will use this chain, LLAM chain. Let's see the code. Here

again we have title and prompt for prompt we have text area and button. So here it looks

same. If button and prompt we are creating model here LLAM and OLLAMA model LLAMA 3.1. But

here for prompt we are creating templates with a string here. We are writing like we are

a helpful assistant. You have been as the following question. Here question we have. Please

provide a detailed and thoughtful response. So you can detail this part. But here we just have

one variable and it is question. Here we are creating prompt templates by using prompt template. Here

we imported it from blank chain prompt and we are importing LLAMA from blank chain

chains. After creating this template we are here it's a string and we are creating

prompt template and we are giving two parameters. Template is this template and we have input

variables here and we just have one input variable. In the next video guys let's make another

small project which has more than one input variables. Here we just have one variable and it is

question and we wrote in the list. And now we have a one prompt template here and we have a model

here. So two, combine these two like two parts model ends this prompt we are using LLAM chain.

So we are giving LLAM, the parameter here LLAM prompt is prompt template here.

Now we are getting response from this chain now. Response will be chain run prompt.

And this prompt we are giving into that and this prompt first go to this question part

and then as a prompt we are giving this part into this model and this model answer

or prompt according to this one and response will be the result the answer. And we are writing

this response with markdown. Let's see let's ask a question for example what is

a shock wave.

Here as you can see we have detailed answer but what's the advantage of using this template?

For example you can change this part. You are a happy assistant. You have a

extra following question. Please provide an detailed and thoughtful response.

For example response as a list list like with short items. For example I

but wherever I ask I always want this answer will be list with short items. This is what I want.

So I just write like this and then write the same what is a shock wave. Let's see the result.

Here as you can see now the result is different. So whatever I ask now answers always will be

a list with these short items. Okay in the next video guys let's learn what happens

when we use several variables like this so we can make it more complex and useful.

If you have any questions please ask me see you in the next video. Bye bye.

## Resources
[[16.py]]