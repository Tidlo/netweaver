import {DataSet, Network} from 'vis';
import React, {Component, createRef} from "react";

// import local resources
import routerIcon from '../img/router.png';
import clientIcon from '../img/client.png';
import switchIcon from '../img/switch.png';


const nodes = new DataSet([
    {id: 1, label: 'Node 1', ip:'12312312'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
]);

// create an array with edges
const edges = new DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
]);

// define network data, include nodes and edges
const data = {
    nodes: nodes,
    edges: edges
};

// define network options
let options = {
    locale: 'en',
    manipulation: {
        initiallyActive: true,
        enabled: true,
    },

};

let routerNumbers = 1;
let clientNumbers = 1;
let switchNumbers = 1;


function addRouter() {
    let id = 'router' + routerNumbers;
    routerNumbers++;
    try {
        nodes.add({
            id: id,
            label: id,
            image: routerIcon,
            shape: 'image',
            routerConfig:{
                rule:'rule1',
            },
        });
    } catch (err) {
        alert(err);
    }
}

function addClient() {
    const ip = '192.168.1.2';
    let id = 'client' + clientNumbers;
    clientNumbers++;
    try {
        nodes.add({
            id: id,
            label: ip,
            image: clientIcon,
            shape: 'image',
        });
    } catch (err) {
        alert(err);
    }
}

function addSwitch() {
    let id = 'switch' + switchNumbers;
    switchNumbers++;
    try {
        nodes.add({
            id: id,
            label: id,
            image: switchIcon,
            shape: 'image',
        });
    } catch (err) {
        alert(err);
    }
}



// initialize your network!
class VisNetwork extends Component {
    constructor() {
        super();
        this.network = {};
        this.appRef = createRef();
    }

    componentDidMount() {
        this.network = new Network(this.appRef.current, data, options);

        this.network.on("click", function (params) {
            params.event = "[original event]";
            console.log(nodes);
        });

        this.network.on("oncontext", function (params) {
            params.event = "[original event]";
            console.log(JSON.stringify(params, null, 4));
        });
    }

    render() {
        let test=()=>{
            console.log(this.network);
            this.network.addEdgeMode();
        };
        return (
            <div>
                <div className="network" ref={this.appRef}/>
                <button className="btn-info btn-sm m-2" onClick={addRouter}>add router</button>
                <button className="btn-warning btn-sm m-2" onClick={addClient}>add client</button>
                <button className="btn-danger btn-sm m-2" onClick={addSwitch}>add switch</button>
                <button className="btn btn-primary btn-sm m-2" onClick={test}>Test</button>
            </div>
        );
    }
}

export default VisNetwork;