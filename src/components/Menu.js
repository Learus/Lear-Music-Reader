import React, { Component } from 'react';
import Popup from 'reactjs-popup';
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

        autoBind(this);
    }

    componentDidMount()
    {
        this.getRecents();
    }

    onRecentClick(file)
    {
        this.props.documentHandler(`./links/${file}`);
    }

    getRecents()
    {
        let cache = fs.readFileSync("./public/data/cache.json", 'utf8');
        cache = JSON.parse(cache);

        return cache.recentFiles;
    }


    clear()
    {
        let cache = fs.readFileSync("./public/data/cache.json", 'utf8');
        cache = JSON.parse(cache);

        cache.recentFiles = [];

        const jsonToWrite = JSON.stringify(cache);
        fs.writeFile("./public/data/cache.json", jsonToWrite, function(err)
        {
            if (err)
            {
                console.error(err);
            }
        });

        this.setState({
            files: []
        })
    }

    render()
    {
        const files = this.getRecents().map( (file) => {
            let toRender = `${file.split(/[\\/]/).pop()}`
            toRender = toRender.substr(0, toRender.lastIndexOf('.'));

            return (
                <button key={file} onClick={() => {this.onRecentClick(toRender)}}>
                    {toRender}
                </button>
            )
        })

        return (
            <Popup 
                className="Menu"
                trigger = {
                    open => (
                        <button 
                            className={open ? "MenuButton Open" : "MenuButton Closed"} 
                            onClick={this.open}
                        >
                            <img className="MenuImg" alt="" src={MenuImg}/>
                        </button>
                    )
                }
                position="bottom left"
                arrow={false}
            >
                <div>
                    <header>
                        Recent Files
                    </header>

                    {files}

                    <button id="ClearRecentButton" onClick={this.clear}>
                        Clear
                    </button>
                </div>
                
            </Popup>
        );
    }
}

export default Menu;