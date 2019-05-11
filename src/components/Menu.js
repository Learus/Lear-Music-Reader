import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MenuImg from "./images/menu.png";

import "../style/Menu.css";

const autoBind = require('auto-bind');
const electron = window.require('electron');
const fs = electron.remote.require('fs');

class Menu extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            open: this.props.open,
            files: []
        }

        autoBind(this);
    }

    componentDidMount()
    {
        this.getRecents();
    }

    onRecentClick(file)
    {
        this.props.documentHandler(`"./links/${file}`);
        this.getRecents();
    }

    getRecents()
    {
        let cache = fs.readFileSync("./public/data/cache.json", 'utf8');
        cache = JSON.parse(cache);

        this.setState({
            files: cache.recentFiles
        })
    }

    open()
    {
        this.setState({
            sideBarStyle: { width: "30%", opacity: "1"},
            open: !this.state.open
        })
    }

    close()
    {
        this.setState({
            sideBarStyle: { width: "0px", opacity: "0"},
            open: !this.state.open
        })
    }

    render()
    {
        const files = this.state.files.map( (file, index) => {
            let toRender = `${file.split(/[\\/]/).pop()}`
            toRender = toRender.substr(0, toRender.lastIndexOf('.'));

            return (
                <li key={file}>
                    <button onClick={() => {this.onRecentClick(toRender)}}>
                        {toRender}
                    </button>
                </li>
            )
        })
        return (
            <div className="Menu">
                <button 
                    className={this.state.open ? "MenuButton Open" : "MenuButton Closed"} 
                    onClick= {this.state.open ? this.close : this.open }>
                    <img className="MenuImg" alt="" src={MenuImg}/>
                </button>

                <div className="MenuSideBar" style={this.state.sideBarStyle}>
                    <header>
                        Recent Files
                        
                    </header>
                    <ol>
                        {files}
                    </ol>
                </div>
            </div>
            

        );
    }
}

export default Menu;