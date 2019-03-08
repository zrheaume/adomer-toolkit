#adomer-toolkit
### A react-app analysis and management tool

#### Warning : As of version 1.0.x this npm package is in development and should be used carefully
Some features may include bugs that can affect your project directory.

#### Important : Usage of adomer-toolkit requires an account with adomer online
Go to https://adomer.herokuapp.com to sign up and view application diagnostics.

## atk CLI
### Installation
In bash, run<br />
<br />
`$ npm install -g adomer-toolkit`<br />
<br />
This will add adomer-toolkit to your global usr/bin and add the global `atk` command to your PATH. <br />
From here, you'll have to [make an account](https://adomer.herokuapp.com) with adomer. Once you've made an account, you must login via the CLI. <br />
`$ atk login -u <username> -p <password>`<br />
If the login is successful, atk will output<br />
`$ atk: client configuration succesful`<br />
<br />
<br />
<br />
### Usage
The main functionality of the atk CLI is to allow you to hook a directory to your account. <br />
This is done using `atk hook`<br />
`atk hook` needs two arguments. The first should be the filepath pointing to the directory you wish to hook.<br />
In the second argument, you must provide a name for your application. This should be flagged with `-a` or `-app`<br />
<br />
`$ atk hook ~/Documents/projects/MyProject -a "My Project"`<br />
<br />
