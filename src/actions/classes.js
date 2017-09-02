// @flow

export const createClass =
(className: string, classCode: string, ifSearchable: boolean, pictureObject: number) =>
  ({type: "CREATE_CLASS", className, classCode, ifSearchable, pictureObject});

export const resetClassName = () => ({type: "RESET_CLASS_NAME"});

export const resetClassCode = () => ({type: "RESET_CLASS_CODE"});

export const addClass = (newClass: Object) => ({type: "ADD_CLASS", newClass});

export const requestLoadClasses = () => ({type: "REQUEST_LOAD_CLASSES"});

export const loadClasses = (classes: Array<Object>) => ({type: "LOAD_CLASSES", classes});

export const loadMoreClasses = () => ({type: "LOAD_MORE_CLASSES"});

export const loadSubchatsOfClass = (parentId: number, subchats: Array<Object>) =>
  ({type: "LOAD_SUBCHATS_OF_CLASS", parentId, subchats});

export const deleteClass = (classId) => ({type: "DELETE_CLASS", classId});


