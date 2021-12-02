import { useState } from 'react';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import Planet from './Planet';

const queryClient = new QueryClient();

const fetchPlanets = async (key, page=1) => {
    const res = await fetch(`http://swapi.dev/api/planets/?page=${page}`);
    return res.json();

}

const Planets = () => {
    const [page, setPage] = useState(1);
    const {
        isLoading,
        isError,
        error,
        data,
    } = useQuery(['planets', page], fetchPlanets);
   
    if (isLoading) return 'Loading...';
    if (error) return 'An error has occured: ' + error;
    console.log(data);
   

    return (
        <div>
            <h2>Planets</h2>

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
                        {data.results.map(planet => <Planet key={planet.name} planet={planet} />)}
                    </div>
                    
                    </>
                )}
            </div> 
        </div>
    )
}

export default function Wraped(){
    return(<QueryClientProvider client={queryClient}>
            <Planets/>
        </QueryClientProvider>
    );
}