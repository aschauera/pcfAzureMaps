import * as React from 'react';
import * as atlas from "azure-maps-control";
import { debug } from 'console';


interface ILayerControlProps {
    map: atlas.Map,
}

interface IState{
    layerUrl :string
}

/**
 * Represents the layer selector control
 */
export default class LayerSelectorControl extends React.Component<ILayerControlProps, IState> {


    constructor(props: ILayerControlProps) {
        super(props);
        this.state = { layerUrl : "" }; 
        this.addLayerClicked = this.addLayerClicked.bind(this);
    }

    /**
     * Handles add layer click event
     * @param e 
     */
    addLayerClicked(event: React.MouseEvent<HTMLButtonElement>) {
        alert('Add layer clicked');
    }

    handleChange(event:React.ChangeEvent<HTMLInputElement>) {
        this.setState({layerUrl: event.target.value});
      }

    LayerUrlTextbox() { return <input type="text" value={ this.state.layerUrl }  defaultValue="Enter URL to Layer" className="textbox" /> }

    AddLayerButton() {
        return <button id='btnAddLayer' onClick={this.addLayerClicked} className="button addbutton" >Add Layer</button>
    }

    /**
     * Render the whole control
     */
    render() {
        return (
            <div>
                <div>
                    <this.LayerUrlTextbox />
                </div>
                <div>
                    <this.AddLayerButton />
                </div>
            </div>
        );
    }
}