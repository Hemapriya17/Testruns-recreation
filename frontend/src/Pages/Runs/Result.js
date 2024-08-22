import React, { useEffect, useState } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

const Result = ({ runData }) => {
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    if (
      runData &&
      runData.inputValues &&
      Object.keys(runData.inputValues).length > 0
    ) {
      const dataToSend = {
        ...runData.inputValues,
        title: runData.procedureName,
      };

      axios
        .post("https://testruns-backends.vercel.app//api/runPython", dataToSend)
        .then((response) => {
          if (response.data && response.data.answer) {
            const answer = response.data.answer[0];
            // Format the calculated results
            const content = `
              <p><strong>Power deviation in watts:</strong> ${answer["Power deviation in watts"]}</p>
              <p><strong>Power deviation in %:</strong> ${answer["Power deviation in %"]}</p>
            `;
            setEditorContent(content);
          } else {
            setEditorContent("<p>No results found.</p>");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setEditorContent("<p>Error fetching data.</p>");
        });
    } else {
      console.error("No input values provided.");
      setEditorContent("<p>No input values provided.</p>");
    }
  }, [runData]);

  return (
    <Editor
      apiKey="q2yws6m7pph5gmrsgwrzp1w0i1rnrvs702bdhigr8tpm4qzf" // Replace with your TinyMCE API key
      value={editorContent}
      init={{
        height: 450,
        menubar: false,
        plugins:
          "advlist autolink lists link image charmap print preview anchor textcolor",
        toolbar:
          "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
      }}
    />
  );
};

export default Result;
