// Build a component UserSearch that:

// Has a text input for a search query
// As the user types, debounce the input by 500ms — don't fire a search on every keystroke
// Once debounced, call a given async function searchUsers(query: string): Promise<string[]> (assume it exists, don't implement it) and display the results as a list
// While a search is in flight, show "Searching..."
// If the input is cleared (empty string), clear results immediately and don't call searchUsers at all
// Important: if the user types fast and triggers multiple searches, make sure a slow-resolving older search doesn't overwrite the result of a newer one that resolved first (the race condition from earlier — apply it here)

import {useState, useEffect} from 'react';

function UserSearch() {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if(!inputValue) {
            // Clear results immediately if input is empty
            setResults([]);
            return;
        }
        setTimeout(() => {
            if (inputValue) {
               setDebouncedValue(inputValue);
            }}, 500);
    }, [inputValue]);
useEffect(() => {
    if(!debouncedValue) {
        return;
    }

    searchUsers(debouncedValue).then((results: string[]) => {
        // Handle results here
        setResults(results);
    }).catch((error: Error | undefined) => {
        // Handle error here
    }), [debouncedValue])

    if(results.length === 0 && inputValue) {
        return <div>Searching...</div>
    }

    return (
        <>
            <input type="text" placeholder="Search users..." value={inputValue} onChange={(e) => {setInputValue(e.target.value)}} />
            {results.length > 0 && (
                <ul>
                    {results.map((result, index) => (
                        <li key={crypto.randomUUID()}>{result}</li>
                    ))}
                </ul>
            )}
        </>
    )
}


export default UserSearch;