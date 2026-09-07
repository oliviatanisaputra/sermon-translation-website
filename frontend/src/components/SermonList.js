import "./Output.css";
import { useState, useEffect} from 'react';
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


function SermonList({ isEditor, refreshTrigger }) {
    const [sermons, setSermons] = useState([]);
    const [selectedSermon, setSelectedSermon] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [saving, setSaving] = useState(false);  


    const fetchSermons = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/sermons");
            const data = await response.json();
            setSermons(data.sermons || []);
        } catch (error) {
            console.error("Error fetching sermons:", error);
            alert("Failed to load sermons");
        } finally {
            setLoading(false);
        }
    };


    // Fetch sermons on mount and when refreshTrigger changes
    useEffect(() => {
        fetchSermons();
    }, [refreshTrigger]); // Refresh when trigger changes


    const handleSelectSermon = (sermon) => {
        setSelectedSermon(selectedSermon?.id === sermon.id
            ? null // If already selected, close it
            : sermon // Otherwise, select it
        );

        setIsEditing(false);
    };


    const handleEditToggle = () => {
        setEditedContent(selectedSermon.content);
        setIsEditing(true);
    };


    const handleSaveEdit = async () => {
        if (!editedContent.trim()) {
            alert("Content cannot be empty.");
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/sermons/${selectedSermon.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editedContent }),
            });
            const data = await response.json();

            if (data.success) {
                alert("Sermon updated succesfully!");
                setIsEditing(false);
                fetchSermons(); // Refresh the list
            } else {
                alert("Failed to update sermon: " + data.error);
            }
        } catch (error) {
            alert("Error updating sermon: " + error.message);
        } finally {
            setSaving(false);
        }
    };


    const handleDelete = async (sermonId) => {
        if (!window.confirm("Are you sure you want to delete this sermon?")) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/sermons/${sermonId}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (data.success) {
                alert("Sermon deleted successfully");
                fetchSermons(); // Refresh the list
            } else {
                alert("Failed to delete sermon");
            }
        } catch (error) {
            alert("Error deleting sermon: " + error.message);
        } finally {
            setSaving(false);
        }
    };


    return (
        <div class="editor-page">
            <h2>Translated Sermon List</h2>

            {loading && <p>Loading sermons...</p>}

            {!loading && sermons.length == 0 && (
                <p>No sermons available. {isEditor && "Start by translating and saving a sermon"}</p>
            )}

            {!loading && sermons.length > 0 && (
                <div class="sermon-list">
                    {sermons.map((sermon) => (
                        <div key={sermon.id}>
                        {/* Sermon Card - Clickable */}
                            <button onClick={() => handleSelectSermon(sermon)} class="sermon-card-header">
                                <h3>{sermon.title}</h3>
                                <p>Date: {sermon.date}</p>
                                <p>Created by: {sermon.created_by}</p>
                                {sermon.last_edited && (
                                <p><strong>Last edited: {sermon.last_edited}</strong></p>
                                )}
                                <p>{selectedSermon?.id === sermon.id ? "Click to hide" : "Click to read"}</p>
                            </button>

                            {/* Sermon Content - Shows when selected */}
                            {selectedSermon?.id === sermon.id && (
                                <div class="sermon-detail">
                                    <h4>Full Sermon:</h4>

                                    {isEditor && isEditing ? (
                                        <div class="editor-block">
                                            {/* <textarea
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                                rows="10"
                                                cols="60"
                                            /> */}
                                            <MDXEditor 
                                                      markdown={editedContent || ""} 
                                                      plugins={mdxPlugins} 
                                                      onChange={(newMarkdown) => setEditedContent(newMarkdown)}
                                                      class="editor-toolbar"
                                                    />
                                        </div>
                                    ) : (
                                        <div class="sermon-content">{sermon.content}</div>
                                    )}

                                    <div class="save-row">
                                        {isEditor && isEditing ? (
                                            <>
                                                <button onClick={handleSaveEdit} disabled={saving}>
                                                    {saving ? "Saving..." : "Save Changes"}
                                                </button>
                                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                                            </>
                                        ) : isEditor && (
                                            <>
                                                <button onClick={handleEditToggle} class="btn-translate">
                                                    Edit Sermon
                                                </button>
                                                <button onClick={() => handleDelete(sermon.id)} class="btn-logout">
                                                    Delete Sermon
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>

                
            )}
        </div>
    );
}

export default SermonList;
