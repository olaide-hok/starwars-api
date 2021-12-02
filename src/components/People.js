import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Person from './Person';

const queryClient = new QueryClient();

const fetchPeople = async (key, page=1) => {
    const res = await fetch(`http://swapi.dev/api/people/?page=${page}`);
    return res.json();
}

const People = () => {
    const [page, setPage] = useState(1);
    const { isLoading, error, isError, data } = useQuery('people', fetchPeople);
   
    if (isLoading) return 'Loading...'
    if (error) return 'An error has occured: ' + error;
    console.log(data);

    return (
        <div>
            <h2>People</h2>

            <div>
                {isLoading ? (
                    <div>Loading...</div>
                ) : isError ? (
                    <div>Error: {error} </div>
                ) : (
                    <>
                    <button
                        onClick={() => setPage(old => Math.max(old - 1, 1))}
                            disabled={page === 1}
                            >Previous Page
                    </button>

                    <span>Current Page: { page }</span>

                    <button
                        onClick={() => setPage(old => (!data || !data.next ? old : old + 1))} 
                        disabled={!data || !data.next}
                        >Next Page
                    </button>

                    <div>
                    { data.results.map(person => <Person key={person.name} person={person}/>)}
                    </div>
                    
                    </>
                )}
                </div>
            
        </div>
    )
}

export default function Wraped(){
    return(<QueryClientProvider client={queryClient}>
            <People/>
        </QueryClientProvider>
    );
}

