import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import MenuImg from "./images/menu.png";
// import Metronome from './Metronome'

import "../css/Menu.css";

const autoBind = require('auto-bind');
const electron = window.require('electron');
const fs = electron.remote.require('fs');


const public_dir = process.env.PUBLIC_URL || "./public";

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
        let cache = fs.readFileSync(public_dir + "/data/cache.json", 'utf8');
        cache = JSON.parse(cache);

        return cache.recentFiles;
    }


    clear()
    {
        const cacheName = public_dir + "/data/cache.json";

        let cache = fs.readFileSync(cacheName, 'utf8');
        cache = JSON.parse(cache);

        cache.recentFiles = [];

        const jsonToWrite = JSON.stringify(cache);
        fs.writeFile(cacheName, jsonToWrite, function(err)
        {
            if (err)
            {
                console.error(err);
            }
        });

        const directory = public_dir + "/links/";

        fs.readdir(directory, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
                fs.unlink(require('path').join(directory, file), err => {
                    if (err) throw err;
                });
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

                    {/* <div className="Line"/>

                    <header>
                        Metronome
                    </header>

                    <Metronome/> */}
                </div>
                
            </Popup>
        );
    }
}

export default Menu;