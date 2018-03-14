import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

interface FetchDataState {
    tracks: ApiResults[];
    loading: boolean;
    value: string;
}


//// Create a Search Component for entering an Artist
// On Search, make an api call to iTunes API to fetch the information about the artist
// API URL: https://itunes.apple.com/search?term=${ARTIST_NAME}

export class FetchData extends React.Component<RouteComponentProps<{}>, FetchDataState> {
    constructor() {
        super();
        this.state = { tracks: [], loading: true, value: "" };
    }


    //use this.handleChange(e) => {} inside the input tag to find out the type of event; we could also just use any
    private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        var newValue: string = event.currentTarget.value;
        this.setState({
            value: newValue
        });
        console.log(this.state)

        //When the Search button is clicked, make a call to the API and display the list of albums, including the album name and album cover inside #albums-container in a grid. Use any CSS technique you are comfortable with (Note: The API will return a list of albums based on the search result. Use your skills to find out what the iTunes API data structure looks like and extract the relevant data from it).
        fetch(`https://itunes.apple.com/search?term=${this.state.value}`)
            .then(response => {
                console.log(response)
                return response.json()
            })
            .then(data => {
                console.log(this.state)
                console.log(data)
                this.setState({ tracks: data.results, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchData.renderResultsTable(this.state.tracks);

        return <div>
            <h1>Search Itunes API</h1>
            <p>This component fetches tracks for the searched artist from the Itunes API</p>
            <div>
                <p>Artist Name: {this.state.value}</p>
                <input onChange={this.handleChange} />
            </div>
            {contents}
        </div>;
    }

    private static renderResultsTable(tracks: ApiResults[]) {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Collection Name</th>
                    <th>Image</th>
                    <th>Track Name</th>
                    <th>Track URL</th>
                </tr>
            </thead>
            <tbody>
                {tracks.map(track =>
                    <tr key={track.trackId}>
                        <td>{track.collectionName}</td>
                        <td><img src={track.artworkUrl100} alt="No Image" className="img-responsive" /></td>
                        <td>{track.trackName}</td>
                        <td><a href={track.trackViewUrl}>Itunes Link</a></td>
                    </tr>
                )}
            </tbody>
        </table>;
    }
}

interface ApiResults {
    trackId: number;
    collectionName: string;
    artworkUrl100: string;
    trackName: string;
    trackViewUrl: string;
}
