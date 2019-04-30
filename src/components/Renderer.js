import React, { Component } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Swipeable } from 'react-swipeable';
import throttle from "lodash.throttle"

import "../style/Renderer.css";


const autoBind = require("auto-bind");

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Renderer extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            width: 100,
            height: 100,
            orientation: 'landscape'
        };

        autoBind(this);
    }

    componentDidMount()
    {
        this.setDivSize();
        window.addEventListener("resize", throttle(this.setDivSize, 500));

        document.onkeydown = (e) =>
        {
            e = e || window.event;

            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                this.props.PrevPage();
            }
            else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                this.props.NextPage();
            }
        }
    }
    
    componentWillUnmount()
    {
        window.removeEventListener("resize", throttle(this.setDivSize, 500));
    }
    
    setDivSize() 
    {
        let width = this.rendererWrapper.getBoundingClientRect().width;
        let height = this.rendererWrapper.getBoundingClientRect().height;
        this.setState({
            width: width,
            height: height,
            orientation: width > height ? "landscape" : "portrait"
        });
    }
    
    onDocumentLoadSuccess({ numPages })
    {
        this.props.numPagesHandler(numPages);
    }

    render() 
    {
        let pageNumbers = [];
        for (let i = 0; i < this.props.pagesToDisplay; i++)
        {
            if (this.props.pageNumber + i > this.props.numPages) continue;
            pageNumbers.push(this.props.pageNumber + i);
        }

        const pagesToDisplay = this.props.pagesToDisplay;
        const orientation = this.state.orientation;
        const width = this.state.width;
        const height = this.state.height - 50;

        const pages = pageNumbers.map( function(num) {
            if (orientation === 'landscape')
            {
                
                return <Page pageNumber={num} height={height} key={num} className="Page" />;
            }
                
            else 
                return <Page pageNumber={num} width={width / pagesToDisplay} key={num} className="Page" />;
        });

        return (
            <div className="Renderer">

                <div className="RendererWrapper" ref={(ref)=>this.rendererWrapper = ref}>
                    <Swipeable
                        onSwipedLeft={this.props.NextPage}
                        onSwipedRight={this.props.PrevPage}
                        trackMouse={true}
                    >
                            <Document
                                file={this.props.document}
                                onLoadSuccess={this.onDocumentLoadSuccess}
                                className="Document"
                            >
                                {pages}
                            </Document>
                    </Swipeable>
                </div>
            </div>
        );
    }
}

export default Renderer;
