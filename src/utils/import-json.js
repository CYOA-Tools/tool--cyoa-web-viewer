export const runJSONFromUpload = (importElementID, onFileLoad) => {
  // @ts-ignore
  var files = document.getElementById(importElementID).files;
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function (e) {
    // @ts-ignore
    var result = JSON.parse(e.target.result);
    onFileLoad(result);
  };

  fr.readAsText(files.item(0));
};
