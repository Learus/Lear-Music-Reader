import React, { Component } from 'react';
import Bar from './sound/Bar.wav';
import Beat from './sound/Beat.wav';
import '../style/Metronome.css';
import '../style/InputRange.css'

class Metronome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            count: 0,
            bpm: 100,
            beatsPerMeasure: 4
        };

        this.Bar = new Audio(Bar);
        this.Beat = new Audio(Beat);
    }

    handleBpmChange = event => {
        const bpm = event.target.value;

        if (this.state.playing) {
            // Stop the old timer and start a new one
            clearInterval(this.timer);
            this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

            // Set the new BPM, and reset the beat counter
            this.setState({
                count: 0,
                bpm
            });
        } else {
            // Otherwise just update the BPM
            this.setState({ bpm });
        }
    }

    handleBeatsPerMeasureChange = event => {
        const beatsPerMeasure = event.target.value;

        if (this.state.playing) {
            // Stop the old timer and start a new one
            clearInterval(this.timer);
            this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);

            // Set the new BPM, and reset the beat counter
            this.setState({
                count: 0,
                beatsPerMeasure
            });
        } else {
            // Otherwise just update the BPM
            this.setState({ beatsPerMeasure });
        }
    }

    playClick = () => {
        const { count, beatsPerMeasure } = this.state;

        // The first beat will have a different sound than the others
        if (count % beatsPerMeasure === 0) {
            this.Bar.play();
        } else {
            this.Beat.play();
        }

        // Keep track of which beat we're on
        this.setState(state => ({
            count: (state.count + 1) % state.beatsPerMeasure
        }));
    }

    startStop = () => {
        if (this.state.playing) {
            // Stop the timer
            clearInterval(this.timer);
            this.setState({
                playing: false
            });
        } else {
            // Start a timer with the current BPM
            this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
            this.setState({
                count: 0,
                playing: true
                // Play a click "immediately" (after setState finishes)
            }, this.playClick);
        }
    }

    render() {
        const { playing, bpm, beatsPerMeasure } = this.state;

        return (
            <div className="Metronome">
                <div className="MetronomeSlider">
                    <div>{bpm} BPM</div>
                    <input
                        type="range"
                        min="60"
                        max="240"
                        value={bpm}
                        onChange={this.handleBpmChange} />
                </div>

                <div className="MetronomeSlider">
                    <div>Beats / Measure: {beatsPerMeasure}</div>
                    <input  
                        type="range"
                        min="1"
                        max="16"
                        value={beatsPerMeasure}
                        onChange={this.handleBeatsPerMeasureChange}
                    />
                </div>
                
                <button onClick={this.startStop}>
                    {playing ? 'Stop' : 'Start'}
                </button>
            </div>
        );
    }
}

export default Metronome;