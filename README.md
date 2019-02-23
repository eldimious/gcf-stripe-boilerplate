# Serverless Payments with Stripe and Google Cloud Functions as FaaS.

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

The data layer is implemented using repositories, that hide the underlying data sources (database, network, cache, etc), and provides an abstraction over them so other parts of the application that make use of the repositories, don't care about the origin of the data and are decoupled from the specific implementations used, like the Mongoose ORM that is used by this app. Furthermore, the repositories are responsible to map the entities they fetch from the data sources to the models used in the applications. This is important to enable the decoupling.

## Domain Layer ##

The domain layer is implemented using services. They depend on the repositories to get the app models and apply the business rules on them. They are not coupled to a specific database implementation and can be reused if we add more data sources to the app or even if we change the database for example from MongoDB to Couchbase Server.

## Routes/Controller Layer ##

This layer is being used in the express app and depends on the domain layer (services). Here we define the routes that can be called from outside. The services are always used as the last middleware on the routes and we must not rely on res.locals from express to get data from previous middlewares. That means that the middlewares registered before should not alter data being passed to the domain layer. They are only allowed to act upon the data without modification, like for example validating the data and skipping calling next().

## Entry point ##

The entry point for the applications is the server.js file. It does not depend on express.js or other node.js frameworks. It is responsible for instantiating the application layers, connecting to the db and  mounting the http server to the specified port.