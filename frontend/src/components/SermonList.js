import { useState, useEffect} from 'react';


function SermonList({ isEditor, refreshTrigger }) {
    const [sermons, setSermons] = useState([]);
    const [selectedSermon, setSelectedSermon] = useState(null);
    const [loading, setLoading] = useState(false);


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
        };
    };


    return (
        <div>
            <h2>Translated Sermon List</h2>

            {loading && <p>Loading sermons...</p>}

            {!loading && sermons.length == 0 && (
                <p>No sermons available. {isEditor && "Start by translating and saving a sermon"}</p>
            )}

            {!loading && sermons.length > 0 && (
                <div>
                    {sermons.map((sermon) => (
                        <div key={sermon.id}>
                        {/* Sermon Card - Clickable */}
                            <button onClick={() => handleSelectSermon(sermon)}>
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
                                <div>
                                    <h4>Full Sermon:</h4>
                                    <div>{sermon.content}</div>

                                    {/* Delete button - only for editors */}
                                    {isEditor && (
                                        <button onClick={() => handleDelete(sermon.id)}>
                                            Delete Sermon
                                        </button>
                                    )}
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
