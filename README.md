# Serverless Payments with Stripe and Google Cloud Functions as FaaS.


[![Build Status](https://travis-ci.org/eldimious/gcf-stripe-boilerplate.svg?branch=master)](https://travis-ci.org/eldimious/gcf-stripe-boilerplate) [![Coverage Status](https://coveralls.io/repos/github/eldimious/gcf-stripe-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/eldimious/gcf-stripe-boilerplate?branch=master)

When we say “serverless”, it doesn’t mean servers are no longer involved. It means that you no longer need to think about them.
Serverless is an approach that aims to eliminate the need to manage infrastructure by:

  - Using a managed FaaS compute service such as AWS Lambda, Webtask, Google Cloud Functions, and IBM OpenWhisk to execute code,
  - Leveraging third-party services and APIs, and
  - Applying serverless architectures and patterns.

FaaS providers such as Gcf offers a new kind of platform that lets you deploy and invoke ephemeral (short-lived) function processes via events to handle individual requests. It provides a means to achieve the serverless dream allowing developers to execute code in response to events without building out or maintaining a complex infrastructure.
 
 `gcf-stripe-boilerplate` is a serverless implementation of basic Stripe requests using Faas(Google Cloud Functions).

# Architecture Overview #
The app is designed to use a layered architecture. The architecture is heavily influenced by the Clean Architecture and Hexagonal Architecture. [Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html) is an architecture where `the business rules can be tested without the UI, database, web server, or any external element`. 

<p align="center">
  <img src="https://cdn-images-1.medium.com/max/719/1*ZNT5apOxDzGrTKUJQAIcvg.png" width="350"/>
  <img src="https://cdn-images-1.medium.com/max/900/0*R7uuhFwZbhcqZSvn" width="350" /> 
</p>

<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1200/0*rFs1UtU4sRns5vCJ.png" width="350" />
  <img src="https://cdn-images-1.medium.com/max/1200/0*C-snK7L4sMn7b6CW.png" width="350" /> 
</p>

Also, in entry point(index.js), I use Dependency Injection(DI). There are many reasons using Dependency Injection as:
1. Decoupling
2. Easier unit testing
3. Faster development
4. Dependency injection is really helpful when it comes to testing. You can easily mock your modules' dependencies using this pattern.

You can take a look at this tutorial: `https://blog.risingstack.com/dependency-injection-in-node-js/`.
According to DI:
  A. High-level modules should not depend on low-level modules. Both should depend on abstractions.
  B. Abstractions should not depend on details.

The code style being used is based on the airbnb js style guide.


## Data Layer ##

The data layer is implemented using repositories, that hide the underlying data sources (BaaS, database, network, cache, etc), and provides an abstraction over them so other parts of the application that make use of the repositories, don't care about the origin of the data and are decoupled from the specific implementations used. Here, we use Stripe as a BaaS provider for both creating customers and payments and exporsure methods.This is important to enable the decoupling.

## Domain Layer ##

The domain layer is implemented using services. They depend on the repositories to get the exported methods and apply the *business rules* on them. They are not coupled to a specific BaaS implementation and can be reused if we change our Baas client from Stripe to another platform.

## Routes/Controller Layer ##

This layer is being used in the exported GCF and depends on the domain layer (services). Here we define the middleware where we specify some validation rules for the requests.

## Entry point ##

The entry point for the applications is the index.js file, where we specify all google cloud functions that we will deploy.

# Quick start #

### Prerequisites ###

Create an .env.yaml file in project root to register the following required environment variable(we need the Stripe secret key, and a custom api key):
  - `STRIPE_SECRET_KEY: "xxxxxxxxxxxx"`
  - `API_KEY: "xxxxxxxxxxxx"`

In order to secure HTTP endpoints we will send as header: `header[api-key]` our own custom **API-KEY**.

### Deployment ###

In order to deploy your functions to gcloud just use gcloud cli, e.g. in order to deploy `createCharge` use this cmd:

```shell
  gcloud config set project PROJECT_ID && gcloud functions deploy createCharge --trigger-http --env-vars-file .env.yaml --runtime nodejs8
```

where `--env-vars-file .env.yaml` flag reads and sets the env vars from your.env.yaml as function's scope.

For more info about enviroment variables in gcf you can take a look at this [link](https://cloud.google.com/functions/docs/env-var#using_environment_variables)

Also you can take a look how we deploy a gcf at this [link](https://cloud.google.com/sdk/gcloud/reference/functions/deploy)

### Usage ###

After you deploy the function in google cloud, you can use them by a HTTP request to their URL. E.g. to trigger `createCharge` gcf we should:

```shell
curl "https://REGION-PROJECT_ID.cloudfunctions.net/createCharge"
```

where:

  - REGION is the region where your function is deployed. This is visible in your terminal when your function finishes deploying.
  
  - PROJECT_ID is your Cloud project ID. This is visible in your terminal when your function finishes deploying.
