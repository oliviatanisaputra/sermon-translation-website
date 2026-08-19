import "./InputSermon.css";
import "./Output.css";

import { useState } from 'react';

function InputSermon({ setResult, username, koreanText, setKoreanText, translatedText, setTranslatedText }) {
    // const [text, setText] = useState("");
    // const [translatedText, setTranslatedText] = useState(null);
    // const [title, setTitle] = useState("");
    // const [date, setDate] = useState("");
    const [state, setState] = useState("");


    // === Handle File Upload ===

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setKoreanText(event.target.result);
                console.log("File content loaded:", event.target.result);
            }
            reader.readAsText(file);
        }
    }


    // === Handle Submit Sermon ===

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Simulate processing the sermon text
    //     const processedResult = `Processed Sermon: ${text}`;
    //     setResult(processedResult);
    // };

    const handleSubmit = async () => {

        if (!koreanText.trim()) {
            alert("Please enter or upload a sermon.");
            return;
        }
        try {
            setState([<div class='loader'></div>]);

            const response = await fetch("http://127.0.0.1:8000/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sermon: koreanText }),
            });
            setState("");
            const data = await response.json();
            console.log("Translation response:", data);
            if (data.error) {
                alert("Translation failed: " + data.error);
                return;
            }
            
            // Backend now returns an array of message objects
            // Extract content from each and join with double newlines
            if (data.translated_text) {
                const fullText = data.translated_text.content
                    .join('\n\n')
                setTranslatedText(fullText);
            } else {
                alert ("Unexpected response format from server");
            }
        } catch (error) {
            alert("Error during translation: " + error.message);
        }
    };


    // // === Save to Database ===

    // const handleSave = async () => {
    //   if (!translatedText) {
    //     alert("No translated text to save.");
    //     return;
    //   }

    //   if (!title.trim() || !date.trim()) {
    //     alert("Please enter title and date.");
    //     return;
    //   }

    //   try {
    //     const response = await fetch("http://127.0.0.1:8000/sermons", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         title: title,
    //         date: date,
    //         content: translatedText,
    //         created_by: username,
    //     }),
    //   });

    //   const data = await response.json();

    //   if (data.success) {
    //     alert("Sermon saved successfully!");
    //       // Clear form
    //       setText("");
    //       setTranslatedText(null);
    //       setTitle("");
    //       setDate("");
    //       setResult(null);
    //     } else {
    //       alert("Failed to save sermon");
    //     }
    //   } catch (error) {
    //     alert("Error saving sermon: " + error.message);
    //   }
    // };


    return (
        <div class="editor-page">
            <h2>Input Sermon</h2>
            <div class="translate-row">
                {/* File Upload */}
                <div>
                    <label>Upload Sermon File:</label><br/>
                    <div class="paste-label">
                        <input type="file" accept=".txt" onChange={handleFileUpload} ></input>
                    </div>
                </div>

                {/* Text Area */}
                <div class="paste-label">
                    <label>Or Type/Paste Sermon:</label><br/>
                    <textarea
                        rows="10"
                        cols="60"
                        value={koreanText}
                        onChange={(e) => setKoreanText(e.target.value)}
                        placeholder="Enter Korean sermon here..."
                        class="sermon-textarea"
                    />
                </div>
            </div>

            {/* Translate Button */}
            <button onClick={handleSubmit} class="btn-translate">Translate</button>

            <h2>Translation Result</h2>

            <div class="loader-container">
                {state}
            </div>
        </div>
    );
}

export default InputSermon;