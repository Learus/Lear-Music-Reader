import React, { Component } from 'react';
import Renderer from "./Renderer";
import TopBar from "./TopBar";
import "../style/App.css";

const autoBind = require('auto-bind');
// const electron = window.require('electron');
// const remote = electron.remote;

class App extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            document: "./data/Mozart.pdf",
            numPages: 0,
            pageNumber: 1,
            pagesToDisplay: 2
        }

        autoBind(this);
    }

    pageNumberHandler(pageNumber)
    {
        this.setState({
            pageNumber: pageNumber
        });
    }

    pagesToDisplayHandler(pagesToDisplay)
    {
        this.setState({
            pagesToDisplay: pagesToDisplay
        })
    }

    documentHandler(document)
    {
        this.setState({
            document: document
        })
    }

    numPagesHandler(numPages)
    {
        this.setState({
            numPages: numPages
        })
    }


    FadeOut()
    {
        let pages = document.getElementsByClassName("Page");
        
        for (let i = 0; i < pages.length; i++)
        {
            pages[i].style.opacity = "0";
            pages[i].style.position = "absolute !important";
            pages[i].style.left = "0px";
        }
    }

    FadeIn()
    {
        {
            let pages = document.getElementsByClassName("Page");
            
            for (let i = 0; i < pages.length; i++)
            {
                pages[i].style.opacity = "1";
            }
        } 
    }

    PrevPage()
    {
        if (this.state.pageNumber < 1) 
        {
            this.setState({pageNumber: 1})
            return;
        }
        if (this.state.pageNumber === 1) return;

        this.FadeOut();

        setTimeout(() => {
            this.setState( {pageNumber : this.state.pageNumber - this.state.pagesToDisplay}, this.FadeIn );
        }, 75);
    }

    NextPage()
    {
        if (this.state.pageNumber > this.state.numPages)
        {
            this.setState({
                pageNumber: this.state.numPages - ( this.state.numPages % this.state.pagesToDisplay - 1)
            })
            return;
        }
        if (this.state.pageNumber + this.state.pagesToDisplay > this.state.numPages) return;

        this.FadeOut();

        setTimeout(() => {
            this.setState( {pageNumber : this.state.pageNumber + this.state.pagesToDisplay}, this.FadeIn )
        }, 75);
    }

    render() 
    {
        return (
            <div className="App">
                <TopBar numPages={this.state.numPages}
                        pageNumber={this.state.pageNumber}
                        pagesToDisplay={this.state.pagesToDisplay}
                        pageNumberHandler={this.pageNumberHandler}
                        pagesToDisplayHandler={this.pagesToDisplayHandler}
                />
                <Renderer document={this.state.document}
                          pagesToDisplay={this.state.pagesToDisplay}
                          numPages={this.state.numPages}
                          pageNumber={this.state.pageNumber}
                          numPagesHandler={this.numPagesHandler}
                          NextPage={this.NextPage}
                          PrevPage={this.PrevPage}
                />
            </div>
        )
    }
}

export default App;
