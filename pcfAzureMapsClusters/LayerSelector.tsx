import * as React from 'react';
import * as atlas from "azure-maps-control";


interface ILayerControlProps{
    map: atlas.Map,
}

/**
 * Represents the layer selector control
 */
export default class LayerSelectorControl extends React.Component<ILayerControlProps, {}> {

    render() {
        return (
            <input id='inputText' defaultValue="Hello from React" />
        );
    }
}