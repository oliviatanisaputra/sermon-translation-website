import "./Output.css";
import { useState } from "react";
import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

const mdxPlugins = [
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  toolbarPlugin({
    toolbarContents: () => (
      <>
        {' '}
        <UndoRedo />
        <BlockTypeSelect />
        <BoldItalicUnderlineToggles />
      </>
    )
  })
];

function Output({ result, koreanText, translatedText, setTranslatedText, username, onSaveSuccess }) {
  // const [translatedText, setTranslatedText] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);


  // === Save to Database ===

    const handleSave = async () => {
      if (!translatedText) {
        alert("No translated text to save.");
        return;
      }

      if (!title.trim() || !date.trim()) {
        alert("Please enter title and date.");
        return;
      }

      setSaving(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/sermons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title,
            date: date,
            content: translatedText,
            created_by: username,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Sermon saved successfully!");
          // Clear form
          setTitle("");
          setDate("");
          onSaveSuccess();
        } else {
          alert("Failed to save sermon");
        }
      } catch (error) {
        alert("Error saving sermon: " + error.message);
      } finally {
        setSaving(false);
      }
    };

    if (!translatedText) {
      return null;
    }


  return (
    <div class="editor-page">
      <h2>Edit Translation</h2>
      <div class="sermon-textarea">
        <MDXEditor 
          markdown={translatedText || ""} 
          plugins={mdxPlugins} 
          onChange={(newMarkdown) => setTranslatedText(newMarkdown)}
          class="editor-toolbar"
        />
      </div>

      <div class="form-row">
        <h2>Save Translation</h2>
        <div class="save-row">
          <label>Title: </label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Sunday Service - Jan 26"
          />
        </div>

        <div class="save-row">
          <label>Date: </label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button onClick={handleSave} disabled={saving} class="btn-save">
          {saving ? 'Saving...' : 'Save Sermon'}
        </button>
      </div>
    </div>
  );
}

export default Output;


// import "./Output.css";
// import { useState } from "react";
// import { MDXEditor, headingsPlugin } from '@mdxeditor/editor'
// import '@mdxeditor/editor/style.css'
// // import ReactMarkdown from 'react-markdown';

// function Output({ result, koreanText, translatedText, username, onSaveSuccess }) {
//   // const [translatedText, setTranslatedText] = useState(null);
//   const [title, setTitle] = useState("");
//   const [date, setDate] = useState("");
//   const [saving, setSaving] = useState(false);


//   // === Save to Database ===

//     const handleSave = async () => {
//       if (!translatedText) {
//         alert("No translated text to save.");
//         return;
//       }

//       if (!title.trim() || !date.trim()) {
//         alert("Please enter title and date.");
//         return;
//       }

//       setSaving(true);
//       try {
//         const response = await fetch("http://127.0.0.1:8000/sermons", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             title: title,
//             date: date,
//             content: translatedText,
//             created_by: username,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         alert("Sermon saved successfully!");
//           // Clear form
//           setTitle("");
//           setDate("");
//           onSaveSuccess();
//         } else {
//           alert("Failed to save sermon");
//         }
//       } catch (error) {
//         alert("Error saving sermon: " + error.message);
//       } finally {
//         setSaving(false);
//       }
//     };

//     if (!translatedText) {
//       return null;
//     }


//   return (
//     <div>
//       <div>
//         {translatedText}
//         {/* <pre>{result}</pre> */}
//       </div>

//       <MDXEditor markdown="# Hello world" plugins={[headingsPlugin()]} />

//       <h3>Save Translation</h3>
//       <div>
//         <label>Title: </label>
//         <input 
//           type="text" 
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="e.g., Sunday Service - Jan 26"
//         />
//       </div>

//       <div>
//         <label>Date: </label>
//         <input 
//           type="date" 
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//       </div>

//       <button onClick={handleSave} disabled={saving}>
//         {saving ? 'Saving...' : 'Save Sermon'}
//       </button>
//     </div>
//   );
// }

// export default Output;
