__Warning : As of version 1.0.x this npm package is in development and should be used carefully__

_Some features may include bugs that can affect your project directory._

__Important : Usage of adomer-toolkit requires an account with adomer online__

_Go to https://adomer.herokuapp.com to sign up and view application diagnostics._

# adomer-toolkit
### A lightweight analysis tool for create-react-app style applications

## atk CLI
The atk CLI is the primary feature of the adomer toolkit, and it provides features to run a series of analyses on create-react-app style applications. The results of these various operations can be transmitted to [adomer online](https://adomer.herokuapp.com/), where you can view statistics and component-tree maps for all of your applications in one easy location. 

### Getting Started
Accessing the atk CLI is as simple as globally installing the adomer-toolkit package. If you don't already have an account with [adomer online](https://adomer.herokuapp.com/), you'll need to make one.

```
$ npm install -g adomer-toolkit

$ atk login -u fooMan -p fooBar
   or
$ atk login -username fooMan -password fooBar
```


__*That's it!*__
If atk exits with `atk client configuration succesful`, you're set. Your local machine is now connected to your adomer online account.

### Adding Applications
Adding applications to your adomer online account allows you to view their attributes through adomer's tree rendering engine, and it's painfully simple.

To add an application, use the __atk hook__ command.
`atk hook` has a mandatory flag of `-a <applicationName>`, and optionally takes in a filepath. If no filepath is given, hook will be run on the working directory from which it was called.

```
   $ cd ./projects/MyProject/
   $ atk hook -a "My Project"
   [[ optionally ]]
   [[ $ atk hook ~/Documents/projects/MyProject/ -a "My Project" ]]
   ...
   $ ok!
```