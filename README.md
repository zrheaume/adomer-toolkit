__Warning : As of version 1.0.x this npm package is in development and should be used carefully__

Some features may include bugs that can affect your project directory.

__Important : Usage of adomer-toolkit requires an account with adomer online__

Go to https://adomer.herokuapp.com to sign up and view application diagnostics.

# adomer-toolkit
### A lightweight analysis tool for create-react-app style applications

## atk CLI
The atk CLI is the primary feature of the adomer toolkit, and it provides features to run a series of analyses on create-react-app style applications. The results of these various operations can be transmitted to [adomer online](https://adomer.herokuapp.com/), where you can view statistics and component-tree maps for all of your applications in one easy location. 

### Getting Started
Accessing the atk CLI is as simple as globally installing the adomer-toolkit package. If you don't already have an account with [adomer online](https://adomer.herokuapp.com/), you'll need to make one.

```
$ npm install -g adomer-toolkit
// done

$ atk login -u fooMan -p fooBar
// atk client configuration successful
```