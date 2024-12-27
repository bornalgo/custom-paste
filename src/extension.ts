import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.customPaste', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const clipboardText = await vscode.env.clipboard.readText();
        const modifiedText = clipboardText.replace(/\\/g, '\\\\');
        const selections = editor.selections;

        editor.edit(editBuilder => {
            selections.forEach(selection => {
                editBuilder.replace(selection, modifiedText);
            });
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
