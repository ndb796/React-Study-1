import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const databaseURL = "https://wordcloudtest1.firebaseio.com/";

class Words extends React.Component {
    constructor() {
        super();
        this.state = {
            words: {}
        };
    }

    _get() {
        fetch(`${databaseURL}/words.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => this.setState({words: words}));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.words != this.state.words
    }

    componentDidMount() {
        this._get();
    }

    render() {
        return (
            <div>
                {Object.keys(this.state.words).map(id => {
                    const word = this.state.words[id];
                    return (
                        <Card key={id}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    가중치: {word.weight}
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    {word.word}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

        );
    }
}

export default Words;