#adomer-toolkit (atk)
### A react-app analysis and management tool

#### Warning : As of version 1.0.x this npm package is in development and should be used carefully
Some features may include bugs that can affect you project directory.

## Usage

adomer-toolkit provides a commandline toolkit that can be used to assist in React development

Installing the package globally from npm gives you access to the
`atk` path.

`npm install -g adomer-toolkit`
`cd ~/projects/myProject`
`atk init -n`

This will create the directory `~/projects/myProject/adomer` which contains a `config.json` file

To run the any of the atk core analysis componenets, use the exposed path `atk@core`

`atk@core` 

`console: 'Running core analysis on ~/projects/myProject'`

Optionally, pass a filepath to atk@core to have it target a different directory than
the current working one



