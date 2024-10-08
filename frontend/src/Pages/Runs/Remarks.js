import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const Remarks = ({ value, onChange }) => {
  return (
    <Editor
      apiKey='q2yws6m7pph5gmrsgwrzp1w0i1rnrvs702bdhigr8tpm4qzf'
      init={{
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
      }}
      value={value}
      onEditorChange={onChange}
    />
  );
};

export default Remarks;
