// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {Student,studentId,studentName, userProvider} from './Student';
import { Class } from './Class';
import { UserItem } from './UserProvider';
import { Command } from './Command';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "guapi" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	

	context.subscriptions.push(vscode.commands.registerCommand('student.login', () => Student.login()));
	context.subscriptions.push(vscode.commands.registerCommand('student.logout', () => Student.logout()));
	context.subscriptions.push(vscode.commands.registerCommand('student.register', () => Student.register()));
	context.subscriptions.push(vscode.commands.registerCommand('class.flush', () => Class.flush()));
	context.subscriptions.push(vscode.commands.registerCommand('class.join', () => Class.join()));

	userProvider.data.push(new UserItem("登陆"));
	userProvider.data.push(new UserItem("注册"));

	userProvider.data[0].command = new Command('login', 'student.login');
	userProvider.data[1].command = new Command('register', 'student.register');

	vscode.window.registerTreeDataProvider('student', userProvider);
	var studentListener = function (event: any) {
		vscode.window.registerTreeDataProvider('student', userProvider);
	};
	//事件
	// if (userProvider.onDidChangedTreeDate !== undefined) {
	// 	userProvider.onDidChangedTreeDate(studentListener);
	// 	console.log("successful!");
	// }

	
}

// this method is called when your extension is deactivated
export function deactivate() { }
