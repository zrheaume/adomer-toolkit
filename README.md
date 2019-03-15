# adomer-toolkit
## A lightweight analysis tool for create-react-app style applications


__Warning : As of version 1.0.x this npm package is in development and should be used carefully__

_Some features may include bugs that can affect your project directory._


## atk CLI
The atk CLI is the primary feature of the adomer toolkit, and it provides features to run a series of analyses on create-react-app style applications. The results of these various operations can be transmitted to [adomer online](https://adomer.herokuapp.com/), where you can view statistics and component-tree maps for all of your applications in one easy location. 

### Getting Started
Accessing the atk CLI is as simple as globally installing the adomer-toolkit package. If you don't already have an account with [adomer online](https://adomer.herokuapp.com/), you'll need to make one.

```console
$ npm install -g adomer-toolkit

$ atk login -u fooMan -p fooBar
optionally
$ atk login -username fooMan -password fooBar

$ atk: client configuration successful
```


__*That's it!*__
If atk exits with `atk client configuration succesful`, you're set. Your local machine is now connected to your adomer online account.

### Adding Applications
Adding applications to your adomer online account allows you to view their attributes through adomer's tree rendering engine, and it's painfully simple.

To add an application, use the __atk hook__ command.
`atk hook` has a mandatory flag of `-a <applicationName>`, and optionally takes in a filepath. If no filepath is given, atk hook is run on the working directory from which it has been called. Optionally, add --verbose for process time logs.

```console
   $ cd ./projects/MyProject/

   $ atk hook -a "My Project"
   optionally
   $ atk hook ~/Documents/projects/MyProject/ -a "My Project"
   
   $ Success! Scraper was added to your adomer online account.
   
   ...
   $ ok!
```

This calls atk's hook method which runs a series of analyses which extract components and create a profile of the application. Once this is complete, the resultant object is transmitted to adomer online's api, and it is added to your account. Now, you can go to the adomer home page to view a quantitative breakdown of your application, as well as an interactive map of your application.


### Updating Applications
When you add an application through the atk CLI, the local machine performs almost all of the analysis on the application, sending only the results to adomer. Because there is no direct storage of the entirety of your code, the atk CLI must run those processes again locally in order to update the statistics and visuals displayed by adomer online. To do this, use atk's `reel` command and flagging the name of the app you want to update with `-a`.

```console
   $ atk reel -a "Scraper"
   ...
   $ Success! Scraper was updated with 5 changes.
```
And now it's done!


__UPCOMING Features__

1.1.x monorepo mapping with support for MERN stacks