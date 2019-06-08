import React, { Component } from 'react';


import Menu from './Menu'

import "../css/TopBar.css";


const autoBind = require("auto-bind");
const electron = window.require('electron');
const dialog = electron.remote.dialog

class TopBar extends Component
{
    constructor(props)
    {
        super(props);

        autoBind(this);
    }

    render()
    {
        return (
            <div className="TopBar">
                <Menu open={false} recentFiles={this.props.recentFiles} documentHandler={this.props.documentHandler}/>
                <DocumentSelection document={this.props.document} onChange={this.props.documentHandler}/>
                <PageController numPages={this.props.numPages} pageNumber={this.props.pageNumber} onChange={this.props.pageNumberHandler}/>
                <PageDisplayController numPages={this.props.numPages} pagesToDisplay={this.props.pagesToDisplay} onChange={this.props.pagesToDisplayHandler}/>
                {/* <Metronome/> */}
            </div>
        );
    }
}


class DocumentSelection extends Component
{
    constructor(props)
    {
        super(props);

        autoBind(this);
    }

    componentDidMount()
    {
        document.onkeydown = (e) =>
        {
            console.log("key press");
            e = e || window.event;

            if (e.code === '79') {
                console.log("ctrl o");
                this.onClick();
            }
        }
    }

    onClick()
    {
        const onChange = this.props.onChange;

        dialog.showOpenDialog({
            properties: ['openFile']
        },
        function(files)
        {
            if (files !== undefined)
            {
                onChange(files[0]);
            }
        })
    }

    render()
    {
        let fileName = `${this.props.document.split(/[\\/]/).pop()}`
        fileName = fileName.substr(0, fileName.lastIndexOf('.'));

        return (
            <div className="OpenFile">
                <button className="OpenFileButton" onClick={this.onClick}>
                    Open File
                </button>
                {fileName}
            </div>
        )
    }
}

class PageController extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            pageText: ""
        }

        autoBind(this);
    }

    onValueChange(event)
    {   
        this.setState({
            pageText: event.target.value
        });
    }

    onSubmit(event)
    {
        event.preventDefault();
        let pageNumber = parseInt(this.state.pageText);

        if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > this.props.numPages) return;

        this.setState({
            pageText: ""
        })
        this.props.onChange(pageNumber);
    }

    render()
    {
        return (
            <div className="PageController">

               

                <form name="pageControllerForm" onSubmit={this.onSubmit}>
                
                    <input  className="PageNumber"
                            type="number" 
                            placeholder={this.props.pageNumber}
                            value={this.state.pageText}
                            onChange={this.onValueChange}
                    />
                    <input  type="submit" 
                            style={{
                                position: "absolute",
                                left: "-9999px",
                                width: "1px",
                                height: "1px"
                            }}
                            tabIndex="-1"
                    />
                </form>

                <p>
                    of {this.props.numPages}
                </p>
            </div>
        );
    }
}

class PageDisplayController extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            pagesToDisplayText: ""
        };

        autoBind(this);
    }

    onValueChange(event)
    {   
        this.setState({
            pagesToDisplayText: event.target.value
        });
    }

    onSubmit(event)
    {
        event.preventDefault();
        let pagesToDisplay = parseInt(this.state.pagesToDisplayText);
        
        if (isNaN(pagesToDisplay) || pagesToDisplay < 1 || pagesToDisplay > this.props.numPages) return;
        
        this.setState({
            pagesToDisplayText: ""
        })

        this.props.onChange(pagesToDisplay);
    }

    render()
    {
        return (
            <div className="PageDisplayController">
                <p>
                    Pages to display:
                </p>
                <form name="pageDisplayControllerForm" onSubmit={this.onSubmit}> 
                    <input  className="PagesToDisplay"
                            type="number" 
                            placeholder={this.props.pagesToDisplay}
                            value={this.state.pagesToDisplayText}
                            onChange={this.onValueChange}
                    />
                    <input  type="submit" 
                            style={{
                                position: "absolute",
                                left: "-9999px",
                                width: "1px",
                                height: "1px"
                            }}
                            tabIndex="-1"
                    />
                </form>
            </div>
        )
    }
}

export default TopBar;