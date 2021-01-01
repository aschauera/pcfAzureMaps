import * as React from 'react';
import * as atlas from "azure-maps-control";
import { debug } from 'console';

/**
 * Holds properties for the layer control
 */
interface ILayerControlProps {
    map: atlas.Map,
}

/**
 * Holds state for the layer control
 */
interface ILayerControlState {
    currentLayer: string,
    allLayers: []
}

/**
 * Represents the layer selector control
 */
export default class LayerSelectorControl extends React.Component<ILayerControlProps, ILayerControlState> {


    constructor(props: ILayerControlProps) {
        super(props);
        this.state = { allLayers: [], currentLayer: "" };
        this.addLayerClicked = this.addLayerClicked.bind(this);
    }

    /**
     * Handles add layer click event
     * @param e 
     */
    addLayerClicked(event: React.MouseEvent<HTMLButtonElement>) {
        alert('Add layer clicked');
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ currentLayer: event.target.value });
    }

    LayerUrlTextbox() { return <input type="text" value={this.state.currentLayer} defaultValue="Enter URL to Layer" className="textbox" /> }

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