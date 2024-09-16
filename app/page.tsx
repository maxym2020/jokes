'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from '@/app/debounce';
import styles from './page.module.css';

interface Joke {
    id: string;
    joke: string;
}

type DebouncedFunction = (term: string) => void;

function App() {
    const [searchText, setSearchText] = useState<string>('');
    const [jokes, setJokes] = useState<Joke[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedJoke, setSelectedJoke] = useState<string>('');
    const [isListOpened, setIsListOpened] = useState<boolean>(false);

    const searchContainerRef = useRef<HTMLDivElement>(null);

    const getJokes: DebouncedFunction = useCallback(
        debounce(async (term: string) => {
            if (!term.trim()) {
                setJokes([]);
                setIsListOpened(false);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://icanhazdadjoke.com/search?term=${term}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );
                const parsed = await response.json();
                setJokes(parsed.results);
                setIsListOpened(parsed.results.length > 0 ? true : false);
            } catch (e) {
                console.error(
                    'Something went wrong. Please reload the page and try again.'
                );
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(e.target.value);
            getJokes(e.target.value);
        },
        [getJokes]
    );

    const handleListOpened = () => {
        setIsListOpened((prev) => !prev);
    };

    const handleJokeClick = (joke: Joke) => {
        setSelectedJoke(joke.joke);
        setIsListOpened(false);
    };

    useEffect(() => {
        const toggleList = (e: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target as Node)
            ) {
                setIsListOpened(false);
            }
        };
        window.document.addEventListener('mousedown', toggleList);
        return () => {
            window.document.removeEventListener('mousedown', toggleList);
        };
    }, [searchContainerRef]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsListOpened(false);
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className={styles.App}>
            <h1 className={styles.title}>Search Jokes</h1>
            <div className={styles.jokePlace}>{selectedJoke}</div>
            <div ref={searchContainerRef} className={styles.mainContainer}>
                <div className={styles.searchContainer}>
                    <input
                        className={styles.search}
                        name="search"
                        value={searchText}
                        onChange={handleInputChange}
                    />
                    {isLoading && <i className={styles.spinner} />}
                    {!isLoading && (
                        <i
                            className={
                                isListOpened ? styles.arrowUp : styles.arrowDown
                            }
                            onClick={handleListOpened}
                        />
                    )}
                </div>
                {isListOpened && (
                    <div>
                        <ul className={styles.jokeList}>
                            {jokes.map((joke: Joke) => (
                                <li
                                    key={joke.id}
                                    onClick={() => handleJokeClick(joke)}
                                >
                                    <div>{joke.joke}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
