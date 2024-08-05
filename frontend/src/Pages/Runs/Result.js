import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const Result = () => {
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/runPython')
      .then(response => {
        if (response.data && response.data.output) {
          setEditorContent(response.data.output);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Editor
      apiKey='q2yws6m7pph5gmrsgwrzp1w0i1rnrvs702bdhigr8tpm4qzf'
      init={{
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      }}
      value={editorContent}
      onEditorChange={(content) => setEditorContent(content)}
    />
  );
};

export default Result;
