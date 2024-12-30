import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.customPaste', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor detected.');
            return;
        }

        const initialCursorPosition = editor.selection.active;

        try {
            // Step 1: Execute the default paste command
            await vscode.commands.executeCommand('editor.action.clipboardPasteAction');

            // Step 2: Identify the range of the pasted text
            const finalCursorPosition = editor.selection.active;
            const pastedRange = new vscode.Range(initialCursorPosition, finalCursorPosition);

            // Step 3: Get the pasted text
            const pastedText = editor.document.getText(pastedRange);

            if (pastedText) {
                // Replace only single backslashes with double backslashes
                const modifiedText = pastedText.replace(/\\(?!\\)/g, '\\\\');

                // Step 4: Replace the pasted text with the modified text
                await editor.edit((editBuilder) => {
                    editBuilder.replace(pastedRange, modifiedText);
                });
            } else {
                vscode.window.showErrorMessage('No text was pasted from the clipboard.');
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`An error occurred: ${errorMessage}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
