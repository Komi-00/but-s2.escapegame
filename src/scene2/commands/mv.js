import { relativeToAbsolutePath, splitPath, getFilesTree, isValidFileName, moveInFilesTree } from "../helpers/files";
import { GlobalState } from "../../globalState";

export function mv(elementName, destinationDirectory) {
    if (!destinationDirectory) {
        this.error("You need to enter a destination directory");
        return;
    }

    if (!isValidFileName(elementName)) {
        this.error("You need to enter a valid file or directory name,\nyou also need to be in same directory of the file you want to move")
        return;
    }

    const elementTree = getFilesTree(GlobalState.savedState.currentLocation);
    if (!elementTree[elementName]) {
        this.error("The file or directory doesn't exist");
        return;
    }

    const filesTree = getFilesTree(relativeToAbsolutePath(splitPath(destinationDirectory)));

    if (!filesTree) {
        if (isValidFileName(destinationDirectory)) {
            this.error("You can't rename directory or file");
        } else {
            this.error("The destination directory doesn't exist");
        }
        return;
    }
    if (filesTree.isFile) {
        this.error("The destination is not a directory");
        return;
    }

    if (filesTree[elementName]) {
        this.error(`The file or folder ${elementName} already exists`)
        return;
    }

    GlobalState.updateSavedState({
        filesTree: moveInFilesTree(GlobalState.savedState.currentLocation, elementName, relativeToAbsolutePath(splitPath(destinationDirectory)))
    });
}