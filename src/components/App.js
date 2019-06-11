import React, { Component } from 'react';
import Renderer from "./Renderer";
import TopBar from "./TopBar";
import "../css/App.css";

const autoBind = require('auto-bind');
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const { ipcRenderer } = window.require('electron');

const public_dir = process.env.PUBLIC_URL || "./public";


class App extends Component
{
    constructor(props)
    {
        super(props);

        let cache = fs.readFileSync(public_dir + "/data/cache.json", 'utf8');
        cache = JSON.parse(cache);

        this.state = {
            recentFiles: cache.recentFiles,
            document: cache.openFile,
            numPages: 0,
            pageNumber: 1,
            pagesToDisplay: cache.pagesToDisplay
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
        let cache = fs.readFileSync(public_dir + "/data/cache.json", 'utf8');
        cache = JSON.parse(cache);
        cache.pagesToDisplay = pagesToDisplay;

        const jsonToWrite = JSON.stringify(cache);

        fs.writeFile(public_dir + "/data/cache.json", jsonToWrite, function(err)
        {
            if (err)
            {
                console.error(err);
            }
        });

        // ipcRenderer.send('reload');

        this.setState({
            pagesToDisplay: pagesToDisplay
        })
    }

    documentHandler(document)
    {
        if (`${document}.ln` === this.state.document) return;

        let cache = fs.readFileSync(public_dir + "/data/cache.json", 'utf8');
        cache = JSON.parse(cache);  

        const ret = ipcRenderer.sendSync('symLinkCreate', document);

        cache.openFile = ret;

        // Remove it if you find it
        const index = cache.recentFiles.indexOf(cache.openFile);
        if (index !== -1) cache.recentFiles.splice(index, 1);

        cache.recentFiles.unshift(cache.openFile);
        
        if (cache.recentFiles.length > cache.maxRecentFiles)
        {
            cache.recentfiles.pop();
        }

        const jsonToWrite = JSON.stringify(cache);
        fs.writeFile(public_dir + "/data/cache.json", jsonToWrite, function(err)
        {
            if (err)
            {
                console.error(err);
            }
        });

        this.setState({
            recentFiles: cache.recentFiles,
            document: ret,
            numPages: 0,
            pageNumber: 1
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
        if (this.state.pageNumber < 1 || this.state.pageNumber - this.state.pagesToDisplay < 1) 
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
                <TopBar document={this.state.document}
                        numPages={this.state.numPages}
                        pageNumber={this.state.pageNumber}
                        pagesToDisplay={this.state.pagesToDisplay}
                        recentFiles={this.state.recentFiles}
                        documentHandler={this.documentHandler}
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
