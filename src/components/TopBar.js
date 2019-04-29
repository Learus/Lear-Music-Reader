import React, { Component } from 'react';
import "../style/TopBar.css"


const autoBind = require("auto-bind");

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
                <PageController numPages={this.props.numPages} pageNumber={this.props.pageNumber} onChange={this.props.pageNumberHandler}/>
            </div>
        );
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

export default TopBar;