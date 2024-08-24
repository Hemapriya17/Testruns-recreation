import React, { useEffect, useState } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import ApiUrl from "../../ServerApi";

const Result = ({ runData }) => {
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (
        runData &&
        runData.inputValues &&
        Object.keys(runData.inputValues).length > 0
      ) {
        const dataToSend = {
          ...runData.inputValues,
          title: runData.procedureName,
        };

        try {
          const response = await axios.post(`${ApiUrl}/api/runPython`, dataToSend);
          if (response.data) {
            const formattedContent = formatContent(response.data);
            setEditorContent(formattedContent);
          } else {
            setEditorContent("<p>No results found.</p>");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setEditorContent("<p>Error fetching data.</p>");
        }
      } else {
        console.error("No input values provided.");
        setEditorContent("<p>No input values provided.</p>");
      }
    };

    fetchData();
  }, [runData]);

  const formatContent = (data) => {
    let content = "";
  
    // Loop through each key in the data object
    Object.entries(data).forEach(([key, values]) => {
      content += `<h3>${key}</h3>`; 
  
      // Loop through each item in the values array (each item is an object)
      values.forEach((item) => {
        Object.entries(item).forEach(([subKey, subValue]) => {
          content += `<p><strong>${subKey}:</strong> ${subValue}</p>`;
        });
      });
    });
  
    return content;
  };
  

  return (
    <Editor
      apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
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
