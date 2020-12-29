import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import * as atlas from "azure-maps-control";
import { TrafficControl } from "./TrafficControl";
import { LayerControl } from "./LayerControl";

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class pcfAzureMapsClusters implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private featureCollection: atlas.data.FeatureCollection;

	private map: atlas.Map;
	private _layerSelectorContainer: HTMLDivElement;
	private _layerFieldSet: HTMLFieldSetElement;
	private _mapContainer: HTMLDivElement;
	private _uploadShpButton: HTMLButtonElement;

	private _layerCounter = 1;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		let _map: atlas.Map;
		//create layer DIV
		this._layerSelectorContainer = document.createElement('div');
		this._layerSelectorContainer.setAttribute("id", "layers");
		this._layerSelectorContainer.setAttribute("style", "float:left;width:20%;min-width:50px;height:100%;");

		this._layerFieldSet = document.createElement('fieldset');
		for (var i = 0; i < 3; i++) {
			var opt = document.createElement('input');
			opt.setAttribute('type', 'checkbox');
			opt.setAttribute('value', 'Layer ' + i);
			opt.setAttribute('id', 'Layer' + i);
			opt.addEventListener('click', this.toggleLayer);
			var label = document.createElement('label');
			label.setAttribute('for', 'Layer' + i);
			label.innerHTML = 'Layer ' + i;
			this._layerFieldSet.appendChild(opt);
			this._layerFieldSet.appendChild(label);
		}
		this._layerSelectorContainer.appendChild(this._layerFieldSet);
		//create map DIV
		this._mapContainer = document.createElement('div');
		this._mapContainer.setAttribute("id", "map");
		this._mapContainer.setAttribute("style", "float:left;width:80%;min-width:290px;height:100%;");

		container.append(this._layerSelectorContainer);
		container.append(this._mapContainer);

		//URL to custom endpoint to fetch Access token
		//var url = 'https://adtokens.azurewebsites.net/api/HttpTrigger1?code=
		//Initialize a map instance.
		_map = new atlas.Map('map', {
			view: "Auto",
			center: [13.48, 47.82],
			zoom: 5,
			//Add your Azure Maps subscription client ID to the map SDK. Get an Azure Maps client ID at https://azure.com/maps
			authOptions: {
				authType: atlas.AuthenticationType.subscriptionKey,
				subscriptionKey: '<key>'
			},
			enableAccessibility: false,
		});


		_map.events.add('ready', function (this: pcfAzureMapsClusters) {

			_map.controls.add([
				new atlas.control.ZoomControl(),
				new atlas.control.StyleControl(),
				new TrafficControl({ style: 'auto' }),
				new LayerControl({ style: 'auto' })
			],
				{
					position: atlas.ControlPosition.TopRight
				});


		});
		this.map = _map;
		this.featureCollection =
		{
			"type": "FeatureCollection",
			"features": []
		};
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		if (context.parameters.dataSet.loading) {
			return;
		}

		if (context.parameters.dataSet.paging.hasNextPage) {
			context.parameters.dataSet.paging.loadNextPage();
		}
		else {

			let _map: atlas.Map;
			_map = this.map;
			//Build feature collection from control data set
			let _locations = context.parameters.dataSet;
			for (let _locationId of _locations.sortedRecordIds) {
				let _longitude = _locations.records[_locationId].getValue("address1_latitude") != null ? _locations.records[_locationId].getFormattedValue("address1_longitude") : "";
				let _latitude = _locations.records[_locationId].getValue("address1_longitude") != null ? _locations.records[_locationId].getFormattedValue("address1_latitude") : "";

				if (_latitude != "" && _longitude != "") {
					const point1 = new atlas.data.Feature(new atlas.data.Point([_longitude.replace(",", ".") as unknown as number, _latitude.replace(",", ".") as unknown as number]), {
						"id": _locations.records[_locationId].getRecordId(),
						"name": _locations.records[_locationId].getFormattedValue("name")
					});
					this.featureCollection.features.push(point1);
				}
			}

			//Create a data source for pins and add it to the map.
			let datasource = new atlas.source.DataSource("ds0", {
				cluster: false
			});


			_map.sources.add(datasource);


			//Create a layer to render the individual locations as pins.
			let pinSymbolLayer = new atlas.layer.SymbolLayer(datasource, "sl1", {
				textOptions: {
					textField: ['get', 'name'],
					offset: [0, -2.5],
					color: 'black'
				}
			})
			//Add points to datasource 
			datasource.add(this.featureCollection);


			//Add all layers to the map.

			_map.layers.add(pinSymbolLayer);
			//Add click handler for pins
			_map.events.add('click', pinSymbolLayer, this.clicked);

			this.map = _map;
		}
	}

	private clicked(e: atlas.MapMouseEvent) {
		if (e.shapes && e.shapes.length > 0) {
			if (e.shapes[0] instanceof atlas.Shape && e.shapes[0].getType() === 'Point') {
				var properties = e.shapes[0].getProperties();
				//Link to entity form
				window.location.href = "https://andreasaschauer1.crm4.dynamics.com/main.aspx?appid=5f0b88a7-1ddc-e911-a995-000d3a3a1688&pagetype=entityrecord&etn=account&id=" + properties.id as string;
			}
		}
	}

	//Toggle layer visibility
	//
	private toggleLayer = (clickEvent: MouseEvent) => {
		var geoJSON;
		// let url = "https://azuremapshapestorage.blob.core.windows.net/shapes/plz-gebiete.json";
		let url = "https://azuremapshapestorage.blob.core.windows.net/shapes/BezirksgrenzenAT.json"

		// JSON.parse(url);

		this._layerCounter++;
		//Create a data source for geoJSON add it to the map.
		let datasourcePoly = new atlas.source.DataSource("ds" + this._layerCounter, {
			cluster: false
		});
		//Add new datasource to map
		this.map.sources.add(datasourcePoly);

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
		this.map.layers.add(polygonLayer);
		this.map.layers.add(linelayer);

		//Import from GeoJSON
		datasourcePoly.importDataFromUrl(url);
		//Update the map view to show the data.
		var bounds = atlas.data.BoundingBox.fromData(datasourcePoly.toJson());
	
		this.map.setCamera({
			bounds: bounds,
			padding: 5
		});

		this.map.events.add('click', polygonLayer, this.polygonClicked);

	}

	///Occurs when a polygon is clicked
	private polygonClicked(e: atlas.MapMouseEvent) {
		if (e.shapes && e.shapes.length > 0) {
			if (e.shapes[0] instanceof atlas.Shape && e.shapes[0].getType() === 'Polygon') {
				var properties = e.shapes[0].getProperties();
				//Highlight
				e.shapes[0].setProperties({
					color: "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
				});
			}
		}
	}
	//Set a random color for all shapes in the datasource
	private randomColorShapes(source: atlas.source.DataSource) {
		var s = source.getShapes();

		if (s.length > 0) {
			var shape = s[s.length - 1];

			//Change the color property of the shape to a random value.
			shape.setProperties({
				color: "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
			});
		}

	}
	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}



}