import * as React from 'react';
import * as atlas from "azure-maps-control";
import { debug } from 'console';
import { LayerUrlTextbox } from './LayerUrlTextBox';
import { AddLayerButton } from './AddLayerButton';
/**
 * Holds properties for the layer control
 */
interface ILayerControlProps {
    map: atlas.Map,
    topLayer: atlas.layer.Layer
}

/**
 * Holds state for the layer control
 */
interface ILayerControlState {
    currentLayer: string,
    allLayers: [ILayer]
}

/**
 * Depicts a single layer in the control
 */
interface ILayer {
    name: string,
    url: string
}

/**
 * Represents the layer selector control
 */
export default class LayerSelectorControl extends React.Component<ILayerControlProps, ILayerControlState> {


    constructor(props: ILayerControlProps) {
        super(props);
        this.state = { allLayers: [{ name: '', url: '' }], currentLayer: '' };
        //this.addLayerClicked = this.addLayerClicked.bind(this);
    }

    private setLayerUrl = (url: string) => {
        this.state = { allLayers: [{ name: '', url: '' }], currentLayer: this.state.currentLayer + url };
    }

    /**
     * Add layer selected on the layer control to the map
     * @param clickEvent Map Click event
     */
    private addLayerToMap = () => {
        // alert('Add layer' + this.state.currentLayer);

        //let url = this.state.currentLayer;
        let url = "https://azuremapshapestorage.blob.core.windows.net/shapes/BezirksgrenzenAT.json";
        // let geoJson = JSON.parse(url);
        let layerCounter = this.state.allLayers.length;

        // let layerCounter = 1;

        //Create a data source for geoJSON add it to the map.
        let datasourcePoly = new atlas.source.DataSource("ds" + layerCounter, {
            cluster: false
        });
        //Add new datasource to map
        this.props.map.sources.add(datasourcePoly);

        // Create fill and line layer
        let polygonLayer = new atlas.layer.PolygonLayer(datasourcePoly, "pl1", {
            fillColor: ['rgb',
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)],
            fillOpacity: 0.8
        });
        let linelayer = new atlas.layer.LineLayer(datasourcePoly, "ll1", {
            strokeColor: 'black',
            strokeWidth: 2
        })

        //Get the current topmost layer and insert the new layers underneath
        let currentTopLayer = this.props.map.layers.getLayers().slice(-1)[0];
        this.props.map.layers.add(linelayer,currentTopLayer);
        this.props.map.layers.add(polygonLayer, linelayer);


        //Import from GeoJSON
        datasourcePoly.importDataFromUrl(url ? url : "");
        //Update the map view to show the data.
        var bounds = atlas.data.BoundingBox.fromData(datasourcePoly.toJson());

        this.props.map.setCamera({
            bounds: bounds,
            padding: 5
        });

        //this.map.events.add('click', polygonLayer, this.polygonClicked);

    }

    /**
     * Add layer selected on the layer control to the map
     * @param clickEvent Map Click event
     */
    private addCityLayerToMap = () => {
        // alert('Add layer' + this.state.currentLayer);

        //let url = this.state.currentLayer;
        let url = "https://azuremapshapestorage.blob.core.windows.net/shapes/Stadtregionen.json";
        // let geoJson = JSON.parse(url);
        let layerCounter = this.state.allLayers.length;

        // let layerCounter = 1;

        //Create a data source for geoJSON add it to the map.
        let datasourcePoly = new atlas.source.DataSource("ds" + layerCounter, {
            cluster: false
        });
        //Add new datasource to map
        this.props.map.sources.add(datasourcePoly);

        // Create fill and line layer
        let polygonLayer = new atlas.layer.PolygonLayer(datasourcePoly, "pl2", {
            fillColor: ['rgb',
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)],
            fillOpacity: 0.8
        });
        let linelayer = new atlas.layer.LineLayer(datasourcePoly, "ll2", {
            strokeColor: 'black',
            strokeWidth: 2
        })

        //Get the current topmost layer and insert the new layers underneath
        let currentTopLayer = this.props.map.layers.getLayers().slice(-1)[0];
        this.props.map.layers.add(linelayer,currentTopLayer);
        this.props.map.layers.add(polygonLayer, linelayer);


        //Import from GeoJSON
        datasourcePoly.importDataFromUrl(url ? url : "");
        //Update the map view to show the data.
        var bounds = atlas.data.BoundingBox.fromData(datasourcePoly.toJson());

        this.props.map.setCamera({
            bounds: bounds,
            padding: 5
        });

        //this.map.events.add('click', polygonLayer, this.polygonClicked);

    }

    /**
     * Render the whole control
     */
    render() {
        return (
            <div>
                <div>
                    <LayerUrlTextbox onUrlChange={this.setLayerUrl} url="" />
                </div>
                <br />
                <div>
                    <AddLayerButton onClick={this.addLayerToMap} text="Bezirke anzeigen" />
                    <AddLayerButton onClick={this.addCityLayerToMap} text="Stadtregionen anzeigen" />
                </div>
            </div>
        );
    }
}


