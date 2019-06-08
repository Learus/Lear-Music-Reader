import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Swipeable } from 'react-swipeable';
import throttle from "lodash.throttle"

import "../css/Renderer.css";


const autoBind = require("auto-bind");

pdfjs.GlobalWorkerOptions.workerSrc = "./pdf.worker.js"

class Renderer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            orientation: 'landscape',

            docStyle: {
                padding: "0",
            },

            docHeight: 0,
            swipHeight: 0
        };

        this.document = React.createRef();
        this.swipeable = React.createRef();
        this.rendererWrapper = React.createRef();

        autoBind(this);
    }

    componentDidMount() {
        this.setDivSize();
        window.addEventListener("resize", throttle(this.setDivSize, 500));

        document.onkeydown = (e) => {
            e = e || window.event;

            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                this.props.PrevPage();
            }
            else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                this.props.NextPage();
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", throttle(this.setDivSize, 500));
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.pagesToDisplay !== nextProps.pagesToDisplay) 
        {
            return true;
        }

        if (this.state.document !== nextState.document) return true;

        return true;
    }



    setDivSize() {
        let width = this.rendererWrapper.getBoundingClientRect().width;
        let height = this.rendererWrapper.getBoundingClientRect().height;

        // console.log("rend width: " + width + " height: " + height)

        this.setState({
            width: width,
            height: height,
            orientation: width > height ? "landscape" : "portrait"
        }, () => {
            setTimeout(() => {
                this.setPadding();
            }, 50);
        });
    }

    setPadding() {
        let docHeight = this.document.getBoundingClientRect().height;
        let swipHeight = this.swipeable.getBoundingClientRect().height;

        if (this.state.docHeight === docHeight && this.state.swipHeight === swipHeight) return 0;


        let padding = (swipHeight - docHeight) / 2

        if (padding < 0) padding = 0;

        padding = `${padding}px 0`

        if (padding === this.state.docStyle.padding) return 0;

        // console.log("swip " + swipHeight + " - doc " + docHeight + " = state: " + this.state.docStyle.padding + ", now: " + padding);

        this.setState({
            docHeight: docHeight,
            swipHeight: swipHeight,
            docStyle: {
                padding: padding
            }
        })

        return padding;
    }

    onDocumentLoadSuccess({ numPages }) {
        this.props.numPagesHandler(numPages);
        this.setDivSize();
    }

    render() {
        let pageNumbers = [];
        for (let i = 0; i < this.props.pagesToDisplay; i++) {
            if (this.props.pageNumber + i > this.props.numPages) continue;
            pageNumbers.push(this.props.pageNumber + i);
        }

        const { pagesToDisplay } = this.props;
        const { width, height, docHeight } = this.state;


        const pages = pageNumbers.map(function (num) {
            if (height < docHeight)
            {
                return <Page pageNumber={num} height={height} key={num} className="Page" />;
            }
            else
            {
                return <Page pageNumber={num} width={width / pagesToDisplay} key={num} className="Page" />;
            }
        });

        return (
            <div className="Renderer">

                <div className="RendererWrapper" ref={ref => { this.rendererWrapper = ReactDOM.findDOMNode(ref) }}>
                    <Swipeable
                        className="Swipeable"
                        ref={ref => { this.swipeable = ReactDOM.findDOMNode(ref) }}
                        onSwipedLeft={this.props.NextPage}
                        onSwipedRight={this.props.PrevPage}
                        trackMouse={true}
                    >
                        <div className="DocumentWrapper" style={this.state.docStyle}>
                            <Document
                                ref={ref => { this.document = ReactDOM.findDOMNode(ref) }}
                                file={this.props.document}
                                onLoadSuccess={this.onDocumentLoadSuccess}
                                className="Document"
                            >
                                {pages}
                            </Document>
                        </div>

                    </Swipeable>
                </div>
            </div>
        );
    }
}

export default Renderer;
