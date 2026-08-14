export function LoadingState(){return <div className="state"><div className="spinner"/><p>Loading your reports…</p></div>}
export function ErrorState({message}){return <div className="state"><h2>Something went wrong</h2><p>{message}</p></div>}
